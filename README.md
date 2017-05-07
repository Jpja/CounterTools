# CounterTools
CounterTools is a modular JavaScript Bitcoin and Counterparty GUI Wallet.

Download the zip file, extract the directory and open index.html. Follow instructions in the GUI.

## Disclaimer
The wallet is not actively maintained. Bugs and loss of funds may occur. No warranty. For development use only.

## Features
- Send BTC, XCP and assets
- View BTC, XCP and asset balances
- Counterwallet compatible passphrase
- Encrypt wallet
- Send to an alias (converts to asset owner address)
- Send to many from a list
- Send any amount of BTC together with asset
- Register alphabetic or numeric asset
- Register anchored asset (numeric asset which is hash of description)
- Register assets in bulk
- Instant asset search
- Broadcast text or bet
- Make many broadcasts from a list
- Notarize a file (broadcast file's SHA256 hash)
- Generate new passphrase
- Generate passphrase with vanity addresses
- Repair a broken passphrase
- Generate paper wallet
- Export keys (all passphrase tools can be used on offline computer)
- YouTube module with relevant Counterparty videos
- Customizable design, menu and modules
- Developer guide
 
## Use Cases

#### Wallet
The wallet can be used out of the box. It is meant to complement Counterwallet, Chrome Wallet and IndieSquare. The same passphrase can be used in every wallet. The advantages of this wallet are
- All files are stored locally
- No installation (only edit a text file)
- Can run from a USB drive or CD rom
- Fees can be custom set
- Can send to alias (asset owner)
- Supports anchored assets
- Quick links to block explorers

DEX support and history will be added shortly.

#### Toolbox
- The send tools make it easy to send, register assets and make broadcasts from a text list.
- The passphrase tools require no Internet access, thus is a safe way to generate keys.

#### Skeleton for other projects
- Fork this project and make your own design.

#### Framework for 3rd party addons
- Rename `template.html` and start building your own plugin immediately.
- A module is only HTML5 and JavaScript.
- Find useful functions in `developer.html`.
- Finally just add a reference to your module in `settings/menu.txt`.

#### Library for other Counterparty projects
- `lib/xcp-toolbox` contatins heaps of useful functions for passphrases, asset validations, API calls, etc.
- `lib/chrome-wallet-mod` is a modified version of Chrome Wallet's library. Redundant API calls, error checks, and user feedback are added.

## Credits
- Joe Looney for his open source [Chrome Extension] (https://github.com/loon3/XCP-Wallet/tree/master/Chrome-Extension).
- Blockscan for Counterparty APIs.
- CounterpartyChain (CoinDaddy) for APIs.
- And the thousands of contributors to codes that this project runs on.
 
## Licence
Free Public License 1.0.0
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


