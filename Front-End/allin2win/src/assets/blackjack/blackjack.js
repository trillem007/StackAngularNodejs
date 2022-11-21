var dealerSum = 0;
var yourSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; 

var NdealerCards = 2;
var NyourCards = 2;


const audio_victory = new Audio('./assets/blackjack/victory.mp3');
const audio_deck = new Audio('./assets/blackjack/deck.mp3');
const audio_card = new Audio('./assets/blackjack/card.mp3');
const audio_chip = new Audio('./assets/blackjack/chip.wav');
const audio_pop = new Audio('./assets/blackjack/pop.wav');

let audioOn = true;
let freezeClic = false;
let bankValue = 1000;
let currentBet = 0;
let lastBetValue= 0;
let profitValue= 0;
let wager = 5;
let lastWager = 0;
let bet = [];

var hidden;
var deck;

var canHit = true; //Permet demanar al jugador (tu) si yourSum <= 21
const back_card = "./assets/blackjack/cards/BACK-ALLINTOWIN.png";

let container = document.createElement('div');
container.setAttribute('id', 'container');
document.body.append(container);

document.onselectstart = function(){    //Desactivar la selecció de text
    return false;
}

buildBoard();

function startPlay() {
    buildDeck();
    shuffleDeck();
    startGame();
}


function buildBoard(){

    let deck_div= document.createElement('div');
    deck_div.setAttribute('id', 'deck_div');
    let deckCard= document.createElement('img');
    deckCard.setAttribute('id', 'deckCard');
    deckCard.setAttribute('src', back_card);
    deck_div.append(deckCard);

    let dealerTitle= document.createElement('h2');
    dealerTitle.setAttribute('id', 'dealer');
    dealerTitle.innerText= 'Dealer:';
    let dealerSpan= document.createElement('span');
    dealerSpan.setAttribute('id', 'dealer-sum');
    dealerTitle.append(dealerSpan);

    let dealerCards= document.createElement('div');
    dealerCards.setAttribute('id', 'dealer-cards');
    

    let youTitle= document.createElement('h2');
    youTitle.setAttribute('id', 'you');
    youTitle.innerText= 'Tu:';
    let youSpan= document.createElement('span');
    youSpan.setAttribute('id', 'your-sum');
    youTitle.append(youSpan);

    let yourCards= document.createElement('div');
    yourCards.setAttribute('id', 'your-cards');

    let playerActions= document.createElement('div');
    playerActions.setAttribute('class', 'playerActions');
    

    let results_div= document.createElement('div');
    results_div.setAttribute('id', 'results_div');

    let results= document.createElement('span');
    results.setAttribute('id', 'results');

    results_div.append(results);


    let bankContainer = document.createElement('div');
    bankContainer.setAttribute('class', 'bankContainer');


    let title_tokens = document.createElement('div');
    title_tokens.setAttribute('class', 'bank_title');
    let title_tokensSpan = document.createElement('span');
    title_tokensSpan.setAttribute('id', 'title_tokensSpan');
    title_tokensSpan.innerText = 'TOKENS';
    title_tokens.append(title_tokensSpan);
    bankContainer.append(title_tokens);

    let bank = document.createElement('div');
    bank.setAttribute('class', 'bank');
    let bankSpan = document.createElement('span');
    bankSpan.setAttribute('id', 'bankSpan');
    bankSpan.innerText = '' + bankValue.toLocaleString("en-GB") + '';
    bank.append(bankSpan);
    bankContainer.append(bank);


    let title_currentBet = document.createElement('div');
    title_currentBet.setAttribute('class', 'bank_title');
    let title_currentBetSpan = document.createElement('span');
    title_currentBetSpan.setAttribute('id', 'title_currentBetSpan');
    title_currentBetSpan.innerText = 'CURRENT BET';
    title_currentBet.append(title_currentBetSpan);
    bankContainer.append(title_currentBet);

    let bet = document.createElement('div');
    bet.setAttribute('class', 'bet');
    let betSpan = document.createElement('span');
    betSpan.setAttribute('id', 'betSpan');
    betSpan.innerText = '' + currentBet.toLocaleString("en-GB") + '';
    bet.append(betSpan);
    bankContainer.append(bet);	

    // 	LAST BET
    let title_lastBet = document.createElement('div');
    title_lastBet.setAttribute('class', 'bank_title');
    let title_lastBetSpan = document.createElement('span');
    title_lastBetSpan.setAttribute('id', 'title_lastBetSpan');
    title_lastBetSpan.innerText = 'LAST BET';
    title_lastBet.append(title_lastBetSpan);
    bankContainer.append(title_lastBet);

    let lastBet = document.createElement('div');
    lastBet.setAttribute('class', 'lastBet');
    let lastBetSpan = document.createElement('span');
    lastBetSpan.setAttribute('id', 'lastBetSpan');
    lastBetSpan.innerText = '' + lastBetValue.toLocaleString("en-GB") + '';
    lastBet.append(lastBetSpan);
    bankContainer.append(lastBet);	

    // 	PROFIT
    let title_profit = document.createElement('div');
    title_profit.setAttribute('class', 'bank_title');
    let title_profitSpan = document.createElement('span');
    title_profitSpan.setAttribute('id', 'title_profitSpan');
    title_profitSpan.innerText = 'LAST PROFIT';
    title_profit.append(title_profitSpan);
    bankContainer.append(title_profit);

    let profit = document.createElement('div');
    profit.setAttribute('class', 'profit');
    let profitSpan = document.createElement('span');
    profitSpan.setAttribute('id', 'profitSpan');
    profitSpan.innerText = '0';
    profit.append(profitSpan);
    bankContainer.append(profit);	
    
   

    let chipDeck = document.createElement('div');
		chipDeck.setAttribute('class', 'chipDeck');
		// VALOR FITXES SELECTOR
		let chipValues = [1, 5, 10, 50, 100, 500, 1000, 5000, 'clear'];
		// let chipValues = [1, 5, 10, 50, 100, 500, 'clear'];
		for(i = 0; i < chipValues.length; i++){
			let cvi = i;
			// COLOR FITXES SELECTOR
			let chipColour = (i == 0)? 'green' : (i == 1)? 'blue cdChipActive' : (i == 2)? 'orange' : (i == 3)? 'red' : (i == 4)? 'gold' 
			: (i == 5)? 'purple' : (i == 6)? 'black' : (i == 7)? 'pink' : 'clearBet';
			let chip = document.createElement('div');
			chip.setAttribute('class', 'cdChip ' + chipColour);

			chip.onclick = function(){
				if(cvi !== 8){
					let cdChipActive = document.getElementsByClassName('cdChipActive');
					for(i = 0; i < cdChipActive.length; i++){
						cdChipActive[i].classList.remove('cdChipActive');
					}
					let curClass = this.getAttribute('class');
					if(!curClass.includes('cdChipActive')){
						this.setAttribute('class', curClass + ' cdChipActive');
					}
                    if (cvi == 6){
                        wager = 1000;
                    }else if(cvi == 7){
                        wager = 5000;
                    }else{
					    wager = parseInt(chip.childNodes[0].innerText);
                    }
				}
				else{

					// IMPORTANT BOTO DE BORRAR (CLEAR)
					if(freezeClic == false){
						bankValue = bankValue + currentBet;
						currentBet = 0;
						document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
						document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
						clearBet();
						removeChips();
					}
				}
			};

            
			let chipSpan = document.createElement('span');
			chipSpan.setAttribute('class', 'cdChipSpan');
                if (!isNaN(chipValues[i]) ){
					if(String(chipValues[i]).length > 4){
						chipSpan.innerText = String(chipValues[i]).substring(-4,2)+ "K";
					}else if(String(chipValues[i]).length == 4){
						chipSpan.innerText = String(chipValues[i]).substring(-4,1)+ "K";
					}else{
						chipSpan.innerText = chipValues[i];
					}
                }else{
                    chipSpan.innerText = chipValues[i];
                }
                // chipSpan.innerText = chipValues[i];
			chip.append(chipSpan);
			chipDeck.append(chip);
		}
    container.append(chipDeck);


    // SWITCH AUDIO
		let audio_div = document.createElement('div');
		audio_div.setAttribute('class', 'audio_div');
		let audio_span = document.createElement('span');
		audio_span.setAttribute('class', 'audio_span');
		audio_span.innerText = "AUDIO";
		let audio_label = document.createElement('label');
		audio_label.setAttribute('class', 'audio_switch');
		let audio_input = document.createElement('input');
		audio_input.setAttribute('type', 'checkbox');
		audio_input.setAttribute('checked','');
		//audio_input.removeAttribute('checked');
		let audio_slider = document.createElement('span');
		audio_slider.setAttribute('class', 'audio_slider');
		audio_label.append(audio_input, audio_slider);

        audio_div.append(audio_span ,audio_label);
        chipDeck.append(audio_div);

        audio_input.onclick = function(){
			if (audioOn){
				audioOn = false;
                audio_victory.pause();
                audio_deck.pause();
                audio_card.pause();
                audio_chip.pause();
                audio_pop.pause();
			}else{
				audioOn = true;
			}
		};


    let instructionsBtn = document.createElement('div');
    instructionsBtn.setAttribute('class', 'instructionsBtn');
    instructionsBtn.onclick = function(){
        if(!container.querySelector('#instructions')){
            instructions();
        }
    };

    let instructionsBtnSpan = document.createElement('span');
    instructionsBtnSpan.setAttribute('class', 'instructionsBtnSpan');
    instructionsBtnSpan.innerText= "INSTRUCCIONS";
    instructionsBtn.append(instructionsBtnSpan);
    container.append(instructionsBtn);



    let bets = document.createElement('div');
    bets.setAttribute('class', 'bets');
    bets.onclick = function(){
        // console.log('THIS', document.getElementsByClassName('chipSpan')[0])
        setBet(this);
    };
    bets.oncontextmenu = function(e){
        e.preventDefault();
        removeBet(this);
    };

    let betsSpan = document.createElement('span');
    betsSpan.setAttribute('class', 'betsSpan');
    betsSpan.innerText= "APOSTES";
    bets.append(betsSpan);
    container.append(bets);

    container.append(deck_div, dealerTitle, dealerCards, youTitle, yourCards, playerActions, results_div, bankContainer);
    

    
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"]; //C -> Clovers (Trebols), D -> Diamants, H -> Cors, S -> Spades (Piques)
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    // console.log(deck);
}

function startGame() {
    

    setTimeout(() => {
        for (let i = 0; i < 4; i++) {
            setTimeout(function()  {
                // console.log(i)
                if (audioOn){
                    audio_card.play();
                }
                if (i % 2){
                    if (i==3){
                        let card_img= document.createElement('img');
                        card_img.setAttribute('id', 'hidden');
                        card_img.setAttribute('src', back_card);
                        document.getElementById('dealer-cards').prepend(card_img);
                        
                        hidden = deck.pop();
                        dealerSum += getValue(hidden);
                        dealerAceCount += checkAce(hidden);
                        // console.log(hidden);

                    }else{
                        let cardImg = document.createElement("img");
                        let card = deck.pop();
                        cardImg.src = "./assets/blackjack/cards/" + card + ".png";
                        dealerSum += getValue(card);
                        dealerAceCount += checkAce(card);
                        document.getElementById("dealer-cards").prepend(cardImg);
                        
                        document.getElementById("dealer-sum").innerText = dealerSum;
                        // console.log('DEALER', dealerSum)
                    }
                }else{
                let cardImg = document.createElement("img");
                let card = deck.pop();
                

                cardImg.src = "./assets/blackjack/cards/" + card + ".png";
                yourSum += getValue(card);
                yourAceCount += checkAce(card);
                document.getElementById("your-cards").prepend(cardImg);
                // $("#deckCard").animate( {
                //     // top: $("#your-cards").offset().top,
                //     // top: 245, left: -410
                //     // left: $("#your-cards").offset().left -405
                    
                //   }, 500, function() {
                //   });

                document.getElementById("your-sum").innerText = yourSum;
                }
                // console.log('SUMA PLAYER',yourSum);

  


            }, i * 1000);
        
            
        }
       
    }, 1000);

    

     /////////////////////////////////////////
    setTimeout(() => {
        
        
    document.getElementById("your-sum").innerText = yourSum;
        let hitBtn= document.createElement('button');
        hitBtn.setAttribute('id', 'hit');
        hitBtn.innerText = "CARTA";

        let stayBtn= document.createElement('button');
        stayBtn.setAttribute('id', 'stay');
        stayBtn.innerText = "PARAR";

        document.getElementsByClassName("playerActions")[0].append(hitBtn, stayBtn);

        if ((yourSum>=9 && yourSum<=11) && (currentBet * 2 <= bankValue)){ //Permetre doblar l'aposta si tens entre 9 i 11 i tens prous tokens.
            let double= document.createElement('button');
            double.setAttribute('id', 'double');
            double.innerText = "DOBLAR";
            double.onclick = function(){
                canHit = true;
                NyourCards += 1;
                bankValue = bankValue - currentBet;
                currentBet = currentBet * 2;
                document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
                document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
                hit();
                setTimeout(() => {
                    stay();
                }, 1000);
                
                this.remove();
                
                
                
            }
            document.getElementsByClassName("playerActions")[0].append(double);
        }


        if ((yourSum == 21 && NyourCards==2) || (dealerSum == 21 && NdealerCards==2)){ //PRIMER TORN (NCARTES == 2)
            canHit= false;
            blackjack();
        }else{
            
            document.getElementById("hit").addEventListener("click", hit);
            document.getElementById("stay").addEventListener("click", stay);
        }
    }, 5000);       //EXECUTA DESPRES D'ENTREGAR TOTES LES CARTES
     
     
    
    
}

function blackjack() {
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";
    if (yourSum == 21 && dealerSum != 21) {
        message = "BLACKJACK!";
        if (audioOn){
            audio_victory.play();
        }
        win(2.5,currentBet, message);
    }
    else if (yourSum == dealerSum) {
        message = "Empat!";
        win(1,currentBet, message);
    }else if (dealerSum==21){
        message = "Has perdut! (BLACKJACK DEL DEALER)";
        win(0,currentBet, message);
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    // document.getElementById("results").innerText = message;
}

function hit() {
    if (!canHit) {
        return;
    }

    if(container.querySelector('#double')){
        document.getElementById('double').remove();
    }

    if (audioOn){
        audio_card.play();
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    // yourSum= reduceAce(yourSum, yourAceCount)
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    // cardImg.animate( {
    //     top: document.getElementById("your-cards").offset().top -2
    //   }, 1000, function() {
    //   });
    
    NyourCards+=1;
    
    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
    // yourSum = reduceAce(yourSum, yourAceCount);

   
    if(reduceAce(yourSum, yourAceCount)>=21){        //Si tens 21 o mes ja no pots demanar mes
        canHit= false;
        
        // yourSum = reduceAce(yourSum, yourAceCount);
        //document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
        stay();
    }
}



function stay() {
    if(container.querySelector('#double')){
        document.getElementById('double').remove();
    }
    if(container.querySelector('#hit')){
        document.getElementById("hit").remove();
    }

    if(container.querySelector('#stay')){
        document.getElementById("stay").remove();
    }

    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    document.getElementById("dealer-sum").innerText = dealerSum;

    
    if (audioOn){
        audio_card.play();
    }
    canHit = false;
    NdealerCards += 1;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let cont= 0;
    setTimeout(() => {
    while (dealerSum < 17) {
        // setInterval(function() {
        // (function(dealerSum) {
            if (audioOn){
                audio_card.play();
            }
            cont += 1
            let cardImg = document.createElement("img");
            let card = deck.pop();
            cardImg.src = "./cards/" + card + ".png";

            dealerSum = reduceAce(dealerSum, dealerAceCount);
            dealerSum += getValue(card);
            dealerAceCount += checkAce(card);
            document.getElementById("dealer-cards").prepend(cardImg);
            
            document.getElementById("dealer-sum").innerText = dealerSum;
            // console.log('DEALER', dealerSum)
            
       
    } 

    setTimeout(() => {
    
    
    

        let message = "";
        if (yourSum > 21) {
            message = "T'has passat de 21!";
            win(0,currentBet, message);
        }
        else if (dealerSum > 21 && yourSum<=21) {
            message = "Has guanyat!";
            // if (audioOn){
            //     audio_victory.play();
            // }
            win(2,currentBet, message)
        }
        //Tu i el dealer <= 21
        else if (yourSum == dealerSum) {
            message = "Empat!";
            
            win(1,currentBet, message)
        }
        else if (yourSum > dealerSum) {
            message = "Has guanyat!";
            // if (audioOn){
            //     audio_victory.play();
            // }
            win(2,currentBet, message)
        }
        else if (yourSum < dealerSum) {
            message = "Has perdut!";
            
            win(0,currentBet, message)
        }
    
        
        if(container.querySelector('#hit')){
            document.getElementById("hit").remove();
        }
    
        if(container.querySelector('#stay')){
            document.getElementById("stay").remove();
        }
        // console.log('CONTADOR:',cont)
        }, cont* 1000)

    }, 1000)

    
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    
    return playerSum;
}


function clearBet(){
    bet = [];
    if(container.querySelector('#play')){
        container.querySelector('#play').remove();
    }
    
}

function setBet(e){
    lastWager = wager;
    wager = (bankValue < wager)? bankValue : wager;
    // console.log('WAGER',wager, e);
    
    if(wager > 0 && freezeClic == false ){
        if (audioOn){
            audio_chip.play();
        }
        
        if(!container.querySelector('#play')){
            
            let play= document.createElement('button');
            play.setAttribute('id', 'play');
            play.onclick = function(){
                freezeClic = true;
                resetGame();
                startPlay();
                // if (audioOn){
                //     audio_deck.play();
                // }
                this.remove();
            }
            play.innerText = "JUGAR";
            
            document.getElementsByClassName("playerActions")[0].append(play);
       
            // container.append(spinBtn);
        }
        bankValue = bankValue - wager;
        // console.log('RESTA', bankValue, wager)
        currentBet = currentBet + wager;
        document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
        document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';

        
        // console.log(wager, currentBet)
        
        // CANVIAR COLOR SEGONS VALOR
        if(!e.querySelector('.chip')){
            let chipColour = (currentBet < 5)? 'green' : ((currentBet < 10)? 'blue' : (currentBet < 50)? 'orange' : (currentBet < 100)? 'red' : (currentBet < 500)? 'gold' : (currentBet < 1000)? 'purple' : (currentBet < 5000)? 'black': 'pink');
            

            let chip = document.createElement('div');
            chip.setAttribute('class', 'chip ' + chipColour);
            let chipSpan = document.createElement('span');
            chipSpan.setAttribute('class', 'chipSpan');

            if(String(wager).length > 4){
                chipSpan.innerText = String(wager).substring(-4,2)+ "K";
            }else if(String(wager).length == 4){
                chipSpan.innerText = String(wager).substring(-4,1)+ "K";
            }else{
                chipSpan.innerText = wager;
            }

            // chipSpan.innerText = wager;
            
            // chipValuesBetText.innerText = wager;/////////
            // console.log('WAGER', wager)
            chip.append(chipSpan);
            
            // chip.append(chipValuesBet); /////////////////////////////////////////////////
            e.append(chip);
        }else{
            let chipColour = (currentBet < 5)? 'green' : ((currentBet < 10)? 'blue' : (currentBet < 50)? 'orange' : (currentBet < 100)? 'red' : (currentBet < 500)? 'gold' : (currentBet < 1000)? 'purple' : (currentBet < 5000)? 'black': 'pink');
            e.querySelector('.chip').style.cssText = '';
            e.querySelector('.chip').setAttribute('class', 'chip ' + chipColour);

            let chipSpan = e.querySelector('.chipSpan');
                if(String(currentBet).length > 4){
                    chipSpan.innerText = String(currentBet).substring(-4,2)+ "K";
                }else if(String(currentBet).length == 4){
                    chipSpan.innerText = String(currentBet).substring(-4,1)+ "K";
                }else{
                    chipSpan.innerText = currentBet;
                }


        }
    }
}


function removeBet(e){
	// console.log('CLICK DRET')
    wager = (wager == 0)? 100 : wager;
    // for(i = 0; i < bet.length; i++){
    //     if(bet[i].numbers == n && bet[i].type == t){
            if(currentBet != 0 && !freezeClic){
                if (audioOn){
                    audio_pop.play();
                }
                wager = (currentBet > wager)? wager : currentBet;
                currentBet = currentBet - wager;
                bankValue = bankValue + wager;
                // currentBet = currentBet - wager;
                document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
                document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
                if(currentBet == 0){
                    e.querySelector('.chip').style.cssText = 'display:none';
                }else{
                    // COLOR FITXES TAULER INICIAL
                    // let chipColour = (currentBet < 5)? 'red' : ((currentBet < 10)? 'blue' : ((currentBet < 100)? 'orange' : 'gold'));
                    
                    let chipColour = (currentBet < 5)? 'green' : ((currentBet < 10)? 'blue' : (currentBet < 50)? 'orange' : (currentBet < 100)? 'red' : (currentBet < 500)? 'gold' : (currentBet < 1000)? 'purple' : (currentBet < 5000)? 'black': 'pink'); 
                    
                    e.querySelector('.chip').setAttribute('class', 'chip ' + chipColour);
                    let chipSpan = e.querySelector('.chipSpan');
                    if(String(currentBet).length > 4){
                        chipSpan.innerText = String(currentBet).substring(-4,2)+ "K";
                    }else if(String(currentBet).length == 4){
                        chipSpan.innerText = String(currentBet).substring(-4,1)+ "K";
                    }else{
                        chipSpan.innerText = currentBet;
                    }

                    // let chipValuesBetText= e.querySelector('.tooltipBetText');/////////
                    // chipValuesBetText.innerText = currentBet;
                }
            }
    //     }
    // }
}

function removeChips(){
    var chips = document.getElementsByClassName('chip');
    if(chips.length > 0){
        for(i = 0; i < chips.length; i++){
            chips[i].remove();
        }
        removeChips();
    }
}
function win(winValue, betTotal, message){

    if(container.querySelector('#double')){
        document.getElementById('double').remove();
    }
    if(container.querySelector('#hit')){
        document.getElementById("hit").remove();
    }

    if(container.querySelector('#stay')){
        document.getElementById("stay").remove();
    }

    winValue = betTotal * winValue;
    bankValue = bankValue + winValue;
    document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';

	lastBetValue = currentBet;
    document.getElementById('lastBetSpan').innerText = '' + lastBetValue.toLocaleString("en-GB") + '';

    currentBet = 0;
    document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
			
    profitValue= winValue-betTotal;
	document.getElementById('profitSpan').innerText = '' + profitValue.toLocaleString("en-GB") + '';

    removeChips();
    // if(winValue > 0){
        // if (audioOn){
        //     audio_victory.play();
        // }

        
        let notification = document.createElement('div');
        notification.setAttribute('id', 'result');
        let nSpan = document.createElement('div');
        nSpan.setAttribute('class', 'nSpan');
        let nsTxt = document.createElement('span');
        nsTxt.innerText = message;
        nSpan.append(nsTxt);
        notification.append(nSpan);
        container.prepend(notification);

    freezeClic = false;
}

function resetGame() {
    canHit = true;
    dealerAceCount = 0;
    yourAceCount = 0; 
    NdealerCards = 2;
    NyourCards = 2;
    dealerSum = 0;
    yourSum = 0;
    
    document.getElementById("dealer-sum").innerText = '';
    document.getElementById("your-sum").innerText = '';
    
    document.getElementById("dealer-cards").innerHTML="";
    document.getElementById("your-cards").innerHTML="";

    if(container.querySelector('#result')){
        document.getElementById("result").remove();
    }
    
}


function instructions() {
    let instructions = document.createElement('div');
        instructions.setAttribute('id', 'instructions');
            let close_div = document.createElement('div');
            close_div.setAttribute('class', 'close_div');
                
            let closeTxt = document.createElement('span');
            closeTxt.innerText = 'X';
            close_div.append(closeTxt);

            close_div.onclick = function(){
                this.remove();
                instructions.remove();
            };

            let instructions_div = document.createElement('div');
            instructions_div.setAttribute('class', 'instructions_div');

            let instructionsTitle = document.createElement('div');
            instructionsTitle.setAttribute('class', 'instructionsTitle');
            let instructionsTitleSpan = document.createElement('span');
            instructionsTitleSpan.setAttribute('class', 'instructionsTitleSpan');
            instructionsTitleSpan.innerHTML = '<h3>INSTRUCCIONS</h3>';
            instructionsTitle.append(instructionsTitleSpan);
            instructions.append(instructionsTitle);

                let instructionsTxt = document.createElement('span');
                instructionsTxt.setAttribute('class', 'instructionsTxt');
                instructionsTxt.innerHTML = `
                Tot i que aquest joc és gratis i no es juga amb diners reals, recorda:<br>
                <h3>JUGA AMB RESPONSABILITAT</h3>
                <br>
                Per <strong>apostar</strong> sel·lecciona la fitxa que vulguis i col·loca les apostes.<br>
                Amb <strong>click dret</strong> restes el valor de la fitxa a l'aposta.<br>
                <strong>Exemple</strong>: Tinc 100 fitxes apostades, si tinc la fitxa de 5 sel·lecionada i faig click dret sobre l'aposta, 
                es restarà 5 a aquella aposta i quedarà 95. <br><br>
                El botó <strong>clear</strong> elimina totes les apostes.
                <br><br>
                Un cop tinguis les apostes, fes click al botó <strong>JUGAR</strong> per començar la partida.
                <br><br>
                <strong>EL JOC</strong><br>
                L'objectiu és simple: guanyar al Croupier obtenint la puntuació més propera a 21. Les figures valen 10, 
                l'As val 11 o 1 (com millor convingui) i totes les altres cartes conserven el seu valor.<br>
                El <strong>Black Jack</strong> es produeix quan les dues (2) primeres cartes són un deu o qualsevol figura més un As.<br>
                Es reparteixen dues cartes a la vista per a cada jugador (la segona del crupier queda oculta fins al seu torn). Aleshores el Croupier preguntarà si necessita una altra carta.
                En aquest cas, senyala-ho amb el botó <strong>CARTA</strong>.<br>
                Si et vols plantar senyala-ho amb el botó <strong>PARAR</strong>.<br><br>
                Podràs <strong>DOBLAR</strong> la teva aposta inicial amb les dues (2) primeres cartes si la suma és 9, 10 o 11, rebent només una carta addicional.
                Si tens Black Jack, guanyes, 
                llevat que el Croupier també tingui Black Jack, cas en què seria un Empat i cap de les dues mans guanya. 
                Si les teves cartes fan un valor més proper a 21 que les del Croupier, guanyes. 
                El crupier començarà a agafar cartes quan tu t'hagis plantat i s'haurà de plantar amb un total de 17 o més i haurà d'agafar una carta més si en té 16 o menys.
            
                <br><br>
                <strong>CONFIGURACIÓ DE JOC</strong><br>
                <strong>AUDIO</strong>: Activa o desactiva els efectes de so.<br>
                <br><br>
                <strong>ECONOMIA</strong><br>
                <strong>TOKENS</strong>: El teu saldo de tokens actual.<br>
                <strong>CURRENT BET</strong>: El total de les apostes que hi ha actualment en el tauler.<br>
                <strong>LAST BET</strong>: El total de les apostes de la partida anterior.<br>
                <strong>LAST PROFIT</strong>: Els guanys / pèrdues de la partida anterior.
                <br><br>
                A continuació es mostren les <strong>relacions de pagament</strong>:
                <br>
                <strong>VICTORIA</strong>: 1 a 1.<br>
                <strong>EMPAT</strong>: recuperes l'aposta.<br>
                <strong>DERROTA</strong>: 0.<br>
                <strong>BLACKJACK</strong>: 3 a 2.
                `;

                instructions_div.append(instructionsTxt);

            instructions.append(close_div ,instructions_div);
        container.prepend(instructions);
    
}