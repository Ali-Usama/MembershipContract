// import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import bg from "./Components/assets/imgs/home-banner-1.jpg";
import img from "./Components/assets/imgs/boho-style-bedding_176382-2339-1.jpg";
import "./Components/assets/css/mainScreen.css";

import {Connection, PublicKey, LAMPORTS_PER_SOL, Keypair} from '@solana/web3.js';
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

    async function getBalance() {
        let connection = (await getProvider()).connection;
        let balance = await connection.getBalance(new web3.PublicKey(window.solana.publicKey.toString()));
        alert(`${balance / LAMPORTS_PER_SOL} SOL`)
        console.log(`${balance / LAMPORTS_PER_SOL} SOL`);
    }

    async function createAccount() {
        let account = Keypair.generate();
        console.log("Account: ", account);
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
        console.log("Member account: ", memberAccount.toString());
        console.log("bump: ", poolBump);

        try {
            /* interact with the program via rpc */
            const tx = await program.methods.transferLamports(poolBump, lamports).accounts({
                from: treasury,
                memberAccount: memberAccount,
                to: receiver,
                systemProgram: SystemProgram.programId,
            }).rpc();
            console.log("Transaction done: ", tx);
            alert(`Transaction Done: ${tx}`);
            const membershipState = await program.account.membershipState.fetch(memberAccount);
            console.log('State: ', membershipState.isMember, ' ', membershipState.bump);

        } catch (err) {
            console.log("Transaction error: ", err);
            alert(`Error: ${err}`)
        }
    }

    if (!wallet.connected) {
        return (
            <div
                style={{
                    backgroundImage: `url(${bg})`,
                }}
                className="for-minting-bg"
            >
                <div className="social-icons-container">
                    <div className="discord-icon icon-common">
                        <i className="fa-brands fa-twitter"></i>
                    </div>
                    <div className="twitter-icon">
                        <i className="fa-brands fa-discord discord"></i>
                    </div>
                </div>
                <div className="minting-main-container">
                    <div className="minting-inner-container">
                        <div className="minting-content-container">
                            <div className="minting-title-container">
                                <h4>Membership App</h4>
                            </div>
                            <div className="minting-supply-container">
                                {/*<p>Total Supply : 3888 NFTs</p>*/}
                            </div>
                            <div className="img-typo-container">
                                <div className="nft-img-container">
                                    <img src={img} alt="NFT"/>
                                </div>
                                <div className="nft-typo-container">
                                    <div className="nft-price-conatainer">
                                        <p className="font-600">Membership Price</p>
                                        <p className="price margin-top">1 SOL + transaction fee</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    color: "white",
                                }}
                                className="minting-selection-container"
                            >
                            </div>
                            <br/>
                            <br/>
                            <br/><br/><br/><br/><br/><br/>
                            <div>
                                <WalletMultiButton/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {

        return (
            <div
                style={{
                    backgroundImage: `url(${bg})`,
                }}
                className="for-minting-bg"
            >
                <div className="social-icons-container">
                    <div className="discord-icon icon-common">
                        <i className="fa-brands fa-twitter"></i>
                    </div>
                    <div className="twitter-icon">
                        <i className="fa-brands fa-discord discord"></i>
                    </div>
                </div>
                <div className="minting-main-container">
                    <div className="minting-inner-container">
                        <div className="minting-content-container">
                            <div className="minting-title-container">
                                <h4>Membership App</h4>
                            </div>
                            <div className="minting-supply-container">
                                {/*<p>Total Supply : 3888 NFTs</p>*/}
                            </div>
                            <div className="img-typo-container">
                                <div className="nft-img-container">
                                    <img src={img} alt="NFT"/>
                                </div>
                                <div className="nft-typo-container">
                                    <div className="nft-price-conatainer">
                                        <p className="font-600">Membership Price</p>
                                        <p className="price margin-top">1 SOL + transaction fee</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    color: "white",
                                }}
                                className="minting-selection-container"
                            >
                            </div>


                            <br/>
                            <br/>
                            <br/><br/><br/><br/>

                            <div className="connect-mint-button-container">
                                {/*<button className="ConnectMint">CONNECT WALLET</button>*/}
                                <button className="ConnectMint" onClick={confirmTransaction}>Confirm Transaction
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

const AppWithProvider = () => (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
        <WalletProvider wallets={wallets}>
            <WalletModalProvider>
                <App/>
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
)
export default AppWithProvider;
