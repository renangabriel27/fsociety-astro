---
title: "eps1.8_m1rr0r1ng.qt"
excerpt: "RAID is not a backup. 3-2-1, restic, tested restores and copies ransomware can't reach."
date: "2026-09-25T15:23:18.000Z"
tags: ["linux"]
cover: "./cover.jpg"
---

Nobody cares about backups. Everybody cares about restores. The difference is usually discovered at 2 a.m., after a disk dies, a script runs `rm -rf` on the wrong path, or ransomware encrypts everything it can reach, including the backup drive that was conveniently plugged in. A mirror of your data is only useful if it's separate from the original in every way that matters. Here's how to build backups you can trust.

## The 3-2-1 rule

- **3** copies of your data: the original plus two backups.
- **2** different media or systems, so one failure mode can't take out both.
- **1** copy off-site, so a fire, flood or theft doesn't either.

A modern extension is 3-2-1-1-0: add **one** copy that's offline or immutable, and aim for **zero** errors in verified restores. That last part is the one people skip.

## RAID is not a backup

RAID protects against a disk failing. That's it. It faithfully mirrors your mistakes in real time: delete a file and it's deleted on every disk; ransomware encrypts both halves of the mirror at once; filesystem corruption is replicated perfectly. Same goes for sync tools like Dropbox or a live `rsync` mirror: sync is availability, backup is history. You need _versions_, going back in time, that can't be changed by whatever just went wrong.

## Tools: rsync and restic

`rsync` is perfect for mirroring and moving data efficiently. With `--link-dest` it can even build cheap daily snapshots using hard links:

```bash
TODAY=$(date -u +%F)
rsync -aH --delete \
  --link-dest=/backup/latest \
  /home/ /backup/$TODAY/ \
&& ln -sfn /backup/$TODAY /backup/latest
```

For real backups I prefer `restic`: encrypted, deduplicated, snapshot-based, and it speaks to local disks, SFTP and S3-compatible storage.

```bash
export RESTIC_REPOSITORY=s3:s3.example.com/my-backups
export RESTIC_PASSWORD_FILE=~/.config/restic/pass

restic init                                   # once
restic backup ~/projects ~/documents --exclude-caches
restic forget --keep-daily 7 --keep-weekly 4 --keep-monthly 12 --prune
restic check --read-data-subset=5%            # verify repository integrity
```

Keep the repository password somewhere that survives losing the machine. An encrypted backup with a lost key is just expensive noise.

## Test your restores

A backup that has never been restored is a hope, not a backup. Schedule restore drills:

```bash
restic snapshots
restic restore latest --target /tmp/restore-test --include ~/projects/api
diff -r ~/projects/api /tmp/restore-test/home/elliot/projects/api && echo "restore OK"
```

For databases, restore the dump into a fresh instance and run a query that proves the data is there. Time it. Your recovery time objective is whatever the drill actually took, not what the wiki says.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/images/m1rr0r1ng/02-kernel-panic.jpg" class="kg-image" alt="Rows of hard drives in a storage rack" loading="lazy"><figcaption>Copies are cheap. Restores you've never tested are not.</figcaption></figure>

## Ransomware-resistant copies

Modern ransomware goes looking for backups first. Design so that a compromised machine can't destroy its own history:

1. **Pull, don't push.** A backup server that pulls from clients can't be wiped by credentials stolen from a client.
2. **Append-only access.** restic's REST server supports `--append-only`; clients can add snapshots but not delete them.
3. **Immutable storage.** S3 Object Lock (compliance mode) or a provider's equivalent keeps objects undeletable for a retention period.
4. **Offline media.** A drive that's unplugged and in a drawer can't be encrypted remotely. Rotate it.
5. **Separate credentials.** Backup admin accounts shouldn't share identity, SSO or passwords with production.

Every system fails eventually. The question is whether it's a bad afternoon or the end of the company.
