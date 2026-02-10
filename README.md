# TipJar STX

A simple onchain STX Tip Jar built on the Stacks blockchain.
Anyone can create a tip jar, receive STX tips, and withdraw their earnings directly to their wallet.

No tokens. No NFTs. Just pure STX.


#  What is TipJar STX

TipJar STX allows creators, builders, and communities to:
	•	Create a public tip jar using their Stacks wallet
	•	Receive STX tips from anyone
	•	Withdraw funds anytime without intermediaries

All transactions are transparent and secured by the Stacks blockchain.



# Features
	•	Stacks wallet connection (Leather and Hiro)
	•	One tip jar per wallet address
	•	Send STX tips to any jar
	•	Onchain balance tracking
	•	Owner-only withdrawals
	•	Mobile-friendly UI



# Tech Stack
	•	Blockchain: Stacks
	•	Smart Contracts: Clarity
	•	Wallet Integration: Stacks Connect
	•	Frontend: React or Next.js
	•	Network: Stacks Testnet and Mainnet



# Smart Contract Overview

Core Functions
	•	create-jar
Registers the caller as a tip jar owner.
	•	tip
Sends STX to a specified tip jar.
	•	withdraw
Allows the jar owner to withdraw their full balance.

Rules
	•	STX only
	•	No admin privileges
	•	Funds are held by the contract until withdrawn
	•	Only the jar owner can withdraw


#  Frontend Pages
	•	Home
	•	Connect wallet
	•	Create tip jar
	•	Find a tip jar by address
	•	Tip Jar Page
	•	Display jar owner
	•	Show total STX received
	•	Tip input and send button
	•	Dashboard
	•	Owner balance
	•	Withdraw funds


# Local Development

Prerequisites
	•	Node.js
	•	Yarn or npm
	•	Clarinet
	•	Leather or Hiro wallet

Install

git clone https://github.com/uniquebeing-base-eth/stx-tip-jar.git
cd tipjar-stx
npm install

Run Frontend

npm run dev




#  Smart Contract Testing

clarinet check
clarinet test




# Deployment
	1.	Deploy the Clarity contract to Stacks testnet
	2.	Update the contract address in the frontend
	3.	Test wallet interactions
	4.	Deploy frontend
	5.	Deploy contract to mainnet



#  Security Notes
	•	Only jar owners can withdraw funds
	•	Contract uses native STX transfers
	•	No reentrancy risks due to Clarity execution model


📄 License

MIT License


🤝 Contributing

Pull requests are welcome.
For major changes, please open an issue first to discuss improvements.

🧡 Built on Stacks

TipJar STX is built to support the Stacks ecosystem and encourage direct, permissionless creator support.
