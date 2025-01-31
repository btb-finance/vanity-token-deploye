# @layerzerolabs/lz-v2-utilities

The LayerZero V2 Utilities package provides a set of essential utilities and modules to facilitate the development and integration of applications with various blockchain networks. It includes functions for packet encoding/decoding, precrime configuration parsing, error parsing, and more.

## Features

- **Packet Encoding/Decoding**: Functions for encoding and decoding packets.
- **Precrime Configuration Parsing**: Functions for parsing precrime configurations.
- **Error Parsing**: Functions for parsing error data.
- **Hex Utilities**: Functions for handling hexadecimal data.
- **Options Management**: Functions for managing options.

## Installation

To install the LayerZero V2 Utilities package, you can use npm or yarn:

```sh
npm install @layerzerolabs/lz-v2-utilities
```

or

```sh
yarn add @layerzerolabs/lz-v2-utilities
```

## Usage

### Packet Encoding/Decoding

#### PacketV1Codec

Encodes and decodes packets using the V1 codec.

```typescript
import { PacketV1Codec } from "@layerzerolabs/lz-v2-utilities";

const packet = {
    version: 1,
    nonce: '1',
    srcEid: 10121,
    sender: '0x7Cff4181f857B06114643D495648A95b3E0B0B81',
    dstEid: 10108,
    receiver: '0x6552e1c444f6a2ce35b22de6a554da8c32c5650db0e0158df2eb0daa51289968',
    guid: '0x6552e1c444f6a2ce35b22de6a554da8c32c5650db0e0158df2eb0daa51289968',
    message: '0xff',
    payload: '',
};

// Encode the packet
const encodedHex = PacketV1Codec.encode(packet);
console.log(`Encoded Packet: ${encodedHex}`);

// Decode the packet
const decodedPacket = PacketV1Codec.from(encodedHex).toPacket();
console.log(`Decoded Packet: ${JSON.stringify(decodedPacket)}`);
```

### Precrime Configuration Parsing

#### parsePrecrimeConfig

Parses the precrime configuration string.

```typescript
import { parsePrecrimeConfig } from "@layerzerolabs/lz-v2-utilities";

const configHex = '0x0002000000000000000500010000000100000000000000000000000000000000000000000000000000000000000111110000000000000000000000000000000000000000000000000000000000011111';

const config = parsePrecrimeConfig(configHex);
console.log(`Parsed Precrime Config: ${JSON.stringify(config)}`);
```

### Error Parsing

#### parseError

Parses the error data.

```typescript
import { parseError } from "@layerzerolabs/lz-v2-utilities";
import { Interface } from "@ethersproject/abi";

const errorData = "0x08c379a0...";
const intf = new Interface(["function myFunction()"]);

const parsedError = parseError(errorData, intf);
console.log(`Parsed Error: ${parsedError}`);
```

### Hex Utilities

#### hexZeroPadTo32

Pads a hexadecimal address to 32 bytes.

```typescript
import { hexZeroPadTo32 } from "@layerzerolabs/lz-v2-utilities";

const address = "0x1234567890abcdef1234567890abcdef12345678";
const paddedAddress = hexZeroPadTo32(address);
console.log(`Padded Address: ${paddedAddress}`);
```

### Options Management

#### optionsType1

Builds OptionsType.TYPE_1.

```typescript
import { optionsType1 } from "@layerzerolabs/lz-v2-utilities";

const extraGas = 200000;
const options = optionsType1(extraGas);
console.log(`Options Type 1: ${options}`);
```