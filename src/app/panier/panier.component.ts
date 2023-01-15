import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ethers } from "ethers"
import MarketplaceAbi from '../../app/contractsData/Marketplace.json'
import MarketplaceAddress from '../../app/contractsData/Marketplace-address.json'
import NFTAbi from '../../app/contractsData/NFT.json'
import NFTAddress from '../../app/contractsData/NFT-address.json'
import { ContractService } from 'src/app/services/contract.service';
import { PanierService } from '../services/panier.service';
import { panier } from '../panier.model';



@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit {
  account:any = null

  panierlist: panier[] = [];
  marketplace:any = {}
  loading:any = true
  nft:any = {}
  items:any=[]

  constructor(private dialog: MatDialog,private contractService:ContractService,private panierService:PanierService) {}
  openDialog() {
    const dialogRef = this.dialog.open(PanierComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  ngOnInit(): void {
    this._getCart();
  }
  formatEther(price:any){
    return ethers.utils.formatEther(price)
  }
  async _getCart() {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    this.account =accounts[0];

    this.panierService.getCartItems( this.account).subscribe((response:any)=>{
      this.panierlist=response;
      console.log(response);
    })

    const marketplace =await new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, this.contractService.signer)
    this.marketplace=marketplace
    console.log("load")
    console.log(this.marketplace)
    const nft = await new ethers.Contract(NFTAddress.address, NFTAbi.abi, this.contractService.signer)
    this.nft=nft
    console.log("connected")

    const itemCount = await (this.marketplace as any).itemCount()
    let items = []

    console.log("///////////////////////////")
    console.log(itemCount)
    console.log(this.panierlist.length)
    console.log("///////////////////////////")

    for (let j = 0; j < this.panierlist.length ; j++){
    for (let i = 1; i <= itemCount; i++) {

console.log(this.panierlist[j].idNFT)

      const item = await (this.marketplace as any).items(i)
      if(item.itemId._hex==this.panierlist[j].idNFT){
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await (this.nft as any).tokenURI(item.tokenId)
        // use uri to fetch the nft metadata stored on ipfs 
        const response = await fetch(uri)
        const metadata = await response.json()
        // get total price of item (item price + fee)
        const totalPrice = await (this.marketplace as any).getTotalPrice(item.itemId)
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image
        })
      }}
    }}
    this.loading=false
    this.items=items
    }

    async deletecart(nftid:any ) {

      for(let i = 0; i < this.panierlist.length; i++)
      {
      
      if(this.panierlist[i].idNFT==nftid)
      {          console.log("xxxxxxxxxxxxxxxx")
      console.log(this.panierlist[i].idNFT)
      console.log(nftid)

        this.panierService.deletecartItmes(this.panierlist[i].id).subscribe((response)=>{
          // this.products=response.produits;
          console.log(nftid);

          console.log("deleted")
          console.log(this.panierlist[i].idNFT)
      
        });
        this._getCart();
      }
      }
        
        }



 async Buypanier(){
  for(let i = 0; i < this.items.length; i++){
    await (await this.marketplace.purchaseItem(this.items[i].itemId, { value: this.items[i].totalPrice })).wait()
    this.panierService.deletenftsold(this.panierlist[i].idNFT).subscribe((response)=>{
      console.log("deleted")
      console.log(this.panierlist[i].idNFT)
  
    });
    }
  this._getCart();
    }
}