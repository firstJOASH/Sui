import { Injectable } from '@nestjs/common';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/bcs';
import { TransactionBlock } from '@mysten/sui.js/transactions';

const suiClient = new SuiClient({
  url: getFullnodeUrl('testnet'), // or mainnet/devnet
});

@Injectable()
export class BlockchainService {
  // private readonly keypair: Ed25519Keypair;
  // private readonly packageId = '0xYOUR_PACKAGE_ID'; // REPLACE with your real package ID

  // constructor() {
  //   const privateKey = process.env.SUI_PRIVATE_KEY || '';
  //   this.keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKey));
  // }

  // async deployEventContract(eventData: any): Promise<string> {
  //   // Optional - left in case you still want to simulate or log
  //   console.log('Deploying event contract:', eventData.title);
  //   return '0xFAKE_CONTRACT_ADDR'; // Stub, since deployment is already done
  // }

  // async mintTicketNFT(ticketData: {
  //   eventId: string;
  //   recipient: string;
  //   metadataUri: string;
  // }): Promise<{
  //   tokenId: string;
  //   transactionHash: string;
  // }> {
  //   const tx = new TransactionBlock();

  //   tx.moveCall({
  //     target: `${this.packageId}::ticket_module::mint_ticket`,
  //     arguments: [
  //       tx.pure(ticketData.eventId),
  //       tx.pure(ticketData.recipient),
  //       tx.pure(ticketData.metadataUri),
  //     ],
  //   });

  //   const result = await suiClient.signAndExecuteTransactionBlock({
  //     signer: this.keypair,
  //     transactionBlock: tx,
  //     options: {
  //       showEffects: true,
  //       showEvents: true,
  //     },
  //   });

  //   const tokenId = result.effects?.created?.[0]?.reference?.objectId || 'unknown';
  //   const transactionHash = result.digest;

  //   return { tokenId, transactionHash };
  // }

  // async validateTicketOnChain(tokenId: string): Promise<boolean> {
  //   try {
  //     const result = await suiClient.getObject({
  //       id: tokenId,
  //       options: { showContent: true },
  //     });

  //     return !!result.data;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // async transferTicketNFT(tokenId: string, toAddress: string): Promise<string> {
  //   const tx = new TransactionBlock();
  //   tx.transferObjects([tx.object(tokenId)], tx.pure(toAddress));

  //   const result = await suiClient.signAndExecuteTransactionBlock({
  //     signer: this.keypair,
  //     transactionBlock: tx,
  //     options: { showEffects: true },
  //   });

  //   return result.digest;
  // }

  // async getGasEstimate(operation: string): Promise<number> {
  //   const gasEstimates = {
  //     mint_ticket: 0.001,
  //     transfer_ticket: 0.0005,
  //     deploy_contract: 0.01,
  //   };

  //   return gasEstimates[operation] || 0.001;
  // }
}
