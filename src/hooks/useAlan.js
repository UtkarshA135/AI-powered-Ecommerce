import {useEffect , useState, useCallback } from 'react'
import alanBtn from '@alan-ai/alan-sdk-web';
import {useCart} from '../context/CartContext';
import items from '../items.json';
//Designing a custom hook
const COMMANDS = {
    OPEN_CART : 'open-cart',
    CLOSE_CART:'close-cart',
    ADD_CART : 'add-to-cart',
    REMOVE_CART : 'remove-from-cart',
    PURCHASE_ITEMS :'purchase-items'
}

export default function useAlan() {
    const {setShowCartItems, isCartEmpty,addToCart,removeFromCart,cart,checkout} = useCart();
const [alanState,setAlanState]=useState();//we will keep the state of button maintained else useEffect will make it again and again.

const openCart = useCallback(
    () => {
        if(isCartEmpty)
        {
            alanState.playText("There are no items in your cart");
        }
        else{
            alanState.playText("Opening the cart");
            setShowCartItems(true);
        }
 
    },
    [alanState,isCartEmpty,setShowCartItems],
)
const closeCart = useCallback(() => {
    if(isCartEmpty)
    {
        alanState.playText("There are no items in your cart");
    }
    else{
        alanState.playText("Closing the cart");
        setShowCartItems(false);
    }
   
},[alanState,setShowCartItems,isCartEmpty])
const addtoCart = useCallback(({detail:{name,quantity}})=>{
    const item = items.find(item => item.name.toLowerCase() === name.toLowerCase());
    if(item==null)
    {
    alanState.playText(`I cannot find the ${name} item in your cart`);
    }
    else{
    addToCart(item.id,quantity);
    alanState.playText(`Added  ${quantity} of the ${name} to the cart`);
    }
    },[alanState,addToCart])
  const removeItem = useCallback(({detail:{name}})=>{
        const e = cart.find(e => e.item.name.toLowerCase() === name.toLowerCase());
        if(e==null)
        {
        alanState.playText(`I cannot find the ${name} item in your cart`);
        }
        else{
        removeFromCart(e.itemId);
        alanState.playText(`Removed  ${name} from your cart`);
        }
        },[alanState,removeFromCart,cart])
        const purchase = useCallback(()=>{
           
            if(isCartEmpty)
            {
            alanState.playText(`Your Cart is empty`);
            }
            else{
            checkout();
            alanState.playText("Purchase Succesfully");
            }
            },[alanState,checkout,isCartEmpty])
useEffect(()=>{
window.addEventListener(COMMANDS.CLOSE_CART,closeCart);
window.addEventListener(COMMANDS.OPEN_CART,openCart);
window.addEventListener(COMMANDS.ADD_CART,addtoCart);
window.addEventListener(COMMANDS.REMOVE_CART,removeItem);
window.addEventListener(COMMANDS.PURCHASE_ITEMS,purchase);
return()=>{

window.removeEventListener(COMMANDS.CLOSE_CART,closeCart);
window.removeEventListener(COMMANDS.OPEN_CART,openCart);
window.removeEventListener(COMMANDS.ADD_CART,addtoCart);
window.removeEventListener(COMMANDS.REMOVE_CART,removeItem);
window.removeEventListener(COMMANDS.PURCHASE_ITEMS,purchase);
}
},[openCart,closeCart,addtoCart,purchase,removeItem])
useEffect(()=>{
    if(alanState!=null)return
    setAlanState(

alanBtn({
    top:"15px",
    left:"15px",
    key:"3b1c3435f0d2419ce9aceb96b78b1c812e956eca572e1d8b807a3e2338fdd0dc/stage",
    onCommand: ({command,payload})=>{
      window.dispatchEvent(new CustomEvent(command,{detail:payload}));
    }
}))
},[alanState]);
}
