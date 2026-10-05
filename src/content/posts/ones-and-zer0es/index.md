---
title: "eps1.1_ones-and-zer0es.mpeg"
excerpt: "Binary, hex, bitwise operators and endianness, and why xxd belongs in your toolkit."
date: "2026-09-11T15:23:18.000Z"
tags: ["fundamentals"]
cover: "./cover.jpg"
---

Everything on your machine is ones and zeroes. Your photos, your passwords, this sentence. Abstractions are comfortable, so most developers never look underneath. Then a file refuses to parse, a checksum doesn't match, or a network packet arrives "corrupted", and the only way to know what's really there is to read the bytes. This post is about learning to read them.

## Bits, bytes and hex

A bit is 0 or 1. A byte is eight bits, so it holds 256 values: 0 to 255. Writing bytes in binary is noisy (`11011110`), and decimal hides the bit boundaries, so we use hexadecimal. One hex digit is exactly four bits, which means one byte is always exactly two hex digits.

<table>
<thead><tr><th>Decimal</th><th>Binary</th><th>Hex</th></tr></thead>
<tbody>
<tr><td>10</td><td><code>0000 1010</code></td><td><code>0x0A</code></td></tr>
<tr><td>127</td><td><code>0111 1111</code></td><td><code>0x7F</code></td></tr>
<tr><td>222</td><td><code>1101 1110</code></td><td><code>0xDE</code></td></tr>
<tr><td>255</td><td><code>1111 1111</code></td><td><code>0xFF</code></td></tr>
</tbody>
</table>

Your shell can convert for you:

```bash
printf '%x\n' 222        # de
printf '%d\n' 0xde       # 222
echo 'obase=2; 222' | bc # 11011110
```

## Bitwise operations

Bitwise operators work on each bit independently. They show up everywhere: file permissions, feature flags, network masks, hashing.

- **AND** (`&`) keeps bits set in both. Use it to test or mask: `flags & 0x04`.
- **OR** (`|`) sets bits: `flags | 0x04`.
- **XOR** (`^`) flips bits where the operands differ. XOR-ing twice with the same value gets you back where you started.
- **Shifts** (`<<`, `>>`) move bits left or right; `1 << 3` is 8.

Unix permissions are a clean example. `chmod 640` is octal, three bits per digit: read (4), write (2), execute (1). So 6 is `110` (rw-), 4 is `100` (r--), 0 is nothing. An IPv4 netmask works the same way: `192.168.1.77 & 255.255.255.0` gives you the network, `192.168.1.0`.

## Endianness

When a number needs more than one byte, someone has to decide which byte goes first. Big-endian stores the most significant byte first; little-endian stores the least significant first. The 32-bit value `0x12345678` looks like this in memory:

```
big-endian:    12 34 56 78
little-endian: 78 56 34 12
```

x86 and most ARM systems are little-endian. Network protocols use big-endian, which is why it's called "network byte order" and why C has `htons()` and `ntohl()`. If an integer you parsed is absurdly large, check the byte order before you check anything else.

## xxd and hexdump belong in your toolkit

File extensions lie. Bytes don't. Most formats start with a "magic number" that identifies them: PNG files begin with `89 50 4E 47`, ELF binaries with `7F 45 4C 46`, ZIP archives with `50 4B`.

```bash
# first 32 bytes of a file, hex + ASCII
xxd -l 32 suspicious.pdf

# canonical hex+ASCII view
hexdump -C config.bin | head

# reverse a hex dump back into binary
xxd -p data.bin > data.hex
xxd -r -p data.hex > restored.bin

# spot invisible characters (BOM, CRLF, tabs)
xxd script.sh | head -n 3
```

That last one has saved me more hours than I'd like to admit. A script that fails with `/bin/bash^M: bad interpreter` has Windows line endings, and `0d 0a` in the dump tells you so instantly. A JSON file that won't parse might start with `ef bb bf`, a UTF-8 byte-order mark.

When something doesn't make sense, stop trusting the tools that interpret data for you. Look at the raw bytes. The truth is always in there, friend. You just have to read it.
