# Circle-Paymaster-Ui

This is a decentralized payment platform built on Arbitrum Sepolia, enabling gasless USDC transfer using Account Abstraction and Circle's Paymaster.

## Features

- **Gasless Transactions**: Users don't need ETH for gas fees
- **USDC Payments**: Stable and widely accepted payment method
- **Account Abstraction**: Enhanced user experience with smart accounts
- **User-Friendly Interface**: Simple and intuitive UI

To add:
- **Automated Payments**

## Tech Stack

- **Account Abstraction**: ERC-4337
- **Frontend**: React/Next.js
- **Backend**: Node.js + Express
- **Blockchain**: Arbitrum Sepolia
- **Token**: Circle USDC

## QuickStart

Follow these steps to set up and run the project locally:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/circle-paymaster-ui.git
    cd circle-paymaster-ui
    ```

2. **Install Dependencies**:
    ```bash
    npm init
    npm install --save viem @circle-fin/modular-wallets-core dotenv
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory and add the required environment variables:
    ```
    OWNER_PRIVATE_KEY=
    RECIPIENT_ADDRESS=
    PAYMASTER_V07_ADDRESS=
    USDC_ADDRESS=
    ```

4. **Run the Transfer**:
    ```bash
    node index.js
    ```


## License

MIT

## ETH Taipei Hackathon 2025

This project was initially built during ETH Taipei Hackathon 2025. It aims to solve the payment challenges in web3 by enabling gasless USDC subscriptions through Account Abstraction and Circle's Paymaster.

>Note: This project is a work in progress, we still need to implement transaction functionality and UI components like pending status, success, and failure notifications.

>Note: The project is finished.