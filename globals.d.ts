// This file allows importing CSS files as modules for TypeScript
// It enables side-effect imports like `import './globals.css'`
declare module "*.css";

// Google API global type declarations
interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }) => void;
  prompt: () => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface GoogleAPI {
  accounts: GoogleAccounts;
}

interface Window {
  google?: GoogleAPI;
}
