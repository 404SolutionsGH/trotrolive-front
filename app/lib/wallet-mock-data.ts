export const mockWallets = [
    {
      id: "native-123",
      type: "native",
      balance: 500.75,
      address: "0241234567" // Phone number for native wallet
    },
    {
      id: "crypto-456",
      type: "crypto",
      balance: 1.25,
      address: "0x7a58c0be72be218b41c608b7fe7c5bb630736c71" // Wallet address for crypto
    }
  ];
  
  export const mockTransactions = [
    {
      id: 1,
      amount: "50.00",
      transaction_type: "DEPOSIT",
      description: "Mobile money deposit",
      created_at: "2025-04-12T15:30:45Z",
      wallet_type: "native"
    },
    {
      id: 2,
      amount: "0.5",
      transaction_type: "DEPOSIT",
      description: "SOL deposit from external wallet",
      created_at: "2025-04-11T12:20:30Z",
      wallet_type: "crypto"
    },
    {
      id: 3,
      amount: "-20.00",
      transaction_type: "PAYMENT",
      description: "Payment for ride to Accra Mall",
      created_at: "2025-04-10T09:15:22Z",
      wallet_type: "native"
    },
    {
      id: 4,
      amount: "-0.05",
      transaction_type: "PAYMENT",
      description: "Payment for international service",
      created_at: "2025-04-09T17:45:10Z",
      wallet_type: "crypto"
    },
    {
      id: 5,
      amount: "0.25",
      transaction_type: "TRANSFER",
      description: "Native to Crypto wallet transfer",
      created_at: "2025-04-08T14:12:05Z",
      wallet_type: "crypto"
    },
    {
      id: 6,
      amount: "-100.00",
      transaction_type: "TRANSFER",
      description: "Transfer to Crypto wallet",
      created_at: "2025-04-08T14:11:55Z",
      wallet_type: "native"
    },
    {
      id: 7,
      amount: "200.00",
      transaction_type: "DEPOSIT",
      description: "Bank transfer deposit",
      created_at: "2025-04-07T10:30:15Z",
      wallet_type: "native"
    },
    {
      id: 8,
      amount: "-0.10",
      transaction_type: "TRANSFER",
      description: "Crypto to Native wallet transfer",
      created_at: "2025-04-06T16:25:40Z",
      wallet_type: "crypto"
    },
    {
      id: 9,
      amount: "45.00",
      transaction_type: "TRANSFER",
      description: "Transfer from Crypto wallet",
      created_at: "2025-04-06T16:25:35Z",
      wallet_type: "native"
    }
  ];