import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BlockchainService } from './blockchain.service';

@ApiTags('blockchain')
@Controller('blockchain')
export class BlockchainController {
  // constructor(private blockchainService: BlockchainService) {}

  // @Post('deploy-contract')
  // @ApiOperation({ summary: 'Deploy event contract to blockchain' })
  // deployContract(@Body() eventData: any) {
  //   return this.blockchainService.deployEventContract(eventData);
  // }

  // @Post('mint-ticket')
  // @ApiOperation({ summary: 'Mint ticket NFT' })
  // mintTicket(@Body() ticketData: any) {
  //   return this.blockchainService.mintTicketNFT(ticketData);
  // }

  // @Get('validate/:tokenId')
  // @ApiOperation({ summary: 'Validate ticket on blockchain' })
  // validateTicket(@Param('tokenId') tokenId: string) {
  //   return this.blockchainService.validateTicketOnChain(tokenId);
  // }

  // @Post('transfer')
  // @ApiOperation({ summary: 'Transfer ticket NFT' })
  // transferTicket(@Body() transferData: {
  //   tokenId: string;
  //   toAddress: string;
  // }) {
  //   return this.blockchainService.transferTicketNFT(
  //     transferData.tokenId,
  //     transferData.toAddress,
  //   );
  // }

  // @Get('gas-estimate/:operation')
  // @ApiOperation({ summary: 'Get gas estimate for operation' })
  // getGasEstimate(@Param('operation') operation: string) {
  //   return this.blockchainService.getGasEstimate(operation);
  // }
}
