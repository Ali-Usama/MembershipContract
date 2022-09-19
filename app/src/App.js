// import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import {Connection, PublicKey} from '@solana/web3.js';
import {AnchorProvider, BN, Program, Provider, web3} from '@project-serum/anchor';
import {utf8} from "@project-serum/anchor/dist/cjs/utils/bytes";
import idl from './idl.json';

import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import {ConnectionProvider, useWallet, WalletProvider} from '@solana/wallet-adapter-react';
import {WalletModalProvider, WalletMultiButton} from '@solana/wallet-adapter-react-ui';

require('@solana/wallet-adapter-react-ui/styles.css');

const wallets = [
    /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
    new PhantomWalletAdapter()

]

const {SystemProgram} = web3;
const opts = {
    preflightCommitment: "processed"
}
const programID = new PublicKey(idl.metadata.address);


function App() {
    const wallet = useWallet();

    async function getProvider() {
        /* create the provider and return it to the caller */
        /* network set to local network for now */
        const network = "https://api.devnet.solana.com";
        const connection = new Connection(network, opts.preflightCommitment);

        return new AnchorProvider(
            connection, wallet, opts.preflightCommitment,
        );
    }

    async function confirmTransaction() {
        const provider = await getProvider()
        console.log("Provider: ", provider);
        const receiver = new web3.PublicKey("B6BoFL6JdEVCw2QWTgyyEttAR4qKSWXhEReaEfcaYtmR");
        const treasury = new web3.PublicKey(window.solana.publicKey.toString());
        console.log("Treasury: ", window.solana.publicKey.toString());
        const lamports = new BN(1000000000);
        /* create the program interface combining the idl, program ID, and provider */
        const program = new Program(idl, programID, provider);
        // let [poolAccount, poolBump] = await web3.PublicKey.findProgramAddress([Buffer.from('vote_account')], window.solana.publicKey);
        let [memberAccount, poolBump] = await web3.PublicKey.findProgramAddress(
            [utf8.encode('vote_account'), window.solana.publicKey.toBuffer()],
            program.programId
        );

        debugger
        console.log("pool account: ", memberAccount.toString());
        console.log("bump: ", poolBump);

        try {
            /* interact with the program via rpc */
            const tx = await program.methods.transferLamports(poolBump).accounts({
                from: treasury,
                memberAccount: memberAccount,
                to: receiver,
                systemProgram: SystemProgram.programId,
            }).rpc();
            console.log("Transaction done: ", tx);
            alert("Transaction Done: ", tx)
            const membershipState = await program.account.membershipState.fetch(memberAccount);
            console.log('State: ', membershipState.isMember, ' ', membershipState.bump);

        } catch (err) {
            console.log("Transaction error: ", err);
            alert("Error:  ", err)
        }
    }

    if (!wallet.connected) {
        /* If the user's wallet is not connected, display connect wallet button. */
        return (

            <div style={{display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
                <h3>Membership App</h3>
                <WalletMultiButton/>
            </div>
        )
    } else {
        return (
            <div className="App">
                <h3>Membership App</h3>
                <div>

                    <button onClick={confirmTransaction}>Confirm Transaction</button>


                </div>
            </div>
        );
    }


}

const AppWithProvider = () => (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                <App/>
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
)
export default AppWithProvider;
