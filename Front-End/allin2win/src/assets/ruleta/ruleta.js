const audio_victory = new Audio('victory.mp3');
	const audio_wheel = new Audio('roulette_wheel3.wav');
	const audio_chip = new Audio('chip.wav');
	const audio_pop = new Audio('pop.wav');
	let freezeClic = false;
	let audioOn = true;
	let autoBet = false;
	let autoSpin = false;
	let bankValue = 1000000;
	let currentBet = 0;
	let lastBetValue = 0;
	let profitValue = 0;
	let wager = 5;
	let lastWager = 0;
	let bet = [];
	let numbersBet = [];
	let previousNumbers = [];

	let numRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
	let wheelnumbersAC = [0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32];

	let container = document.createElement('div');
	container.setAttribute('id', 'container');

	document.body.append(container);

	startGame();

	let wheel = document.getElementsByClassName('wheel')[0];
	let ballTrack = document.getElementsByClassName('ballTrack')[0];

	function resetGame() {
		bankValue = 1000;
		currentBet = 0;
		wager = 5;
		bet = [];
		numbersBet = [];
		previousNumbers = [];
		document.getElementById('betting_board').remove();
		document.getElementById('notification').remove();
		buildBettingBoard();
	}

	function startGame() {
		buildWheel();
		buildBettingBoard();
		buildConfig();
	}


	function buildConfig() {

		// CONFIG

		let config_div = document.createElement('div');
		config_div.setAttribute('class', 'config_div');

		// SWITCH AUTOBET
		let autobet_div = document.createElement('div');
		autobet_div.setAttribute('class', 'autobet_div');
		let autobet_span = document.createElement('span');
		autobet_span.setAttribute('class', 'autobet_span');
		autobet_span.innerText = "AUTOBET";
		let autobet_label = document.createElement('label');
		autobet_label.setAttribute('class', 'autobet_switch');
		let autobet_input = document.createElement('input');
		autobet_input.setAttribute('type', 'checkbox');
		let autobet_slider = document.createElement('span');
		autobet_slider.setAttribute('class', 'autobet_slider');
		autobet_label.append(autobet_input, autobet_slider);

		let tooltipAutobet = document.createElement('div');
		tooltipAutobet.setAttribute('class', 'tooltip tooltipAutobet');
		let tooltipAutobetTitle = document.createElement('span');
		tooltipAutobetTitle.setAttribute('class', 'tooltiptitle');
		let tooltipAutobetText = document.createElement('span');
		tooltipAutobetText.setAttribute('class', 'tooltiptext');
		tooltipAutobetText.innerText = "Activa autobet per repetir la última aposta automaticament.";
		tooltipAutobetTitle.innerText = "?";
		tooltipAutobet.append(tooltipAutobetTitle, tooltipAutobetText);

		autobet_div.append(autobet_span, autobet_label, tooltipAutobet);

		// SWITCH AUTOSPIN
		let autospin_div = document.createElement('div');
		autospin_div.setAttribute('class', 'autospin_div');
		let autospin_span = document.createElement('span');
		autospin_span.setAttribute('class', 'autospin_span');
		autospin_span.innerText = "AUTOSPIN";
		let autospin_label = document.createElement('label');
		autospin_label.setAttribute('class', 'autospin_switch');
		let autospin_input = document.createElement('input');
		autospin_input.setAttribute('type', 'checkbox');
		let autospin_slider = document.createElement('span');
		autospin_slider.setAttribute('class', 'autospin_slider');
		autospin_label.append(autospin_input, autospin_slider);

		let tooltipAutospin = document.createElement('div');
		tooltipAutospin.setAttribute('class', 'tooltip tooltipAutospin');
		let tooltipAutospinTitle = document.createElement('span');
		tooltipAutospinTitle.setAttribute('class', 'tooltiptitle');
		let tooltipAutospinText = document.createElement('span');
		tooltipAutospinText.setAttribute('class', 'tooltiptext');
		tooltipAutospinText.innerText = "Tira la ruleta automaticament (si hi ha apostes a la taula).";
		tooltipAutospinTitle.innerText = "?";
		tooltipAutospin.append(tooltipAutospinTitle, tooltipAutospinText);

		autospin_div.append(autospin_span, autospin_label, tooltipAutospin);


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
		audio_input.setAttribute('checked', '');
		let audio_slider = document.createElement('span');
		audio_slider.setAttribute('class', 'audio_slider');
		audio_label.append(audio_input, audio_slider);

		let tooltipAudio = document.createElement('div');
		tooltipAudio.setAttribute('class', 'tooltip tooltipAudio');
		let tooltipAudioTitle = document.createElement('span');
		tooltipAudioTitle.setAttribute('class', 'tooltiptitle');
		let tooltipAudioText = document.createElement('span');
		tooltipAudioText.setAttribute('class', 'tooltiptext');
		tooltipAudioText.innerText = "Activa o desactiva els efectes de so.";
		tooltipAudioTitle.innerText = "?";
		tooltipAudio.append(tooltipAudioTitle, tooltipAudioText);


		audio_div.append(audio_span, audio_label, tooltipAudio);

		config_div.append(autobet_div, autospin_div, audio_div);

		container.append(config_div);
		autobet_input.onclick = function () {
			if (autoBet) {
				autoBet = false;
			} else {
				autoBet = true;
			}
		};

		autospin_input.onclick = function () {
			if (autoSpin) {
				autoSpin = false;
				autospin_input.removeAttribute('checked');
			} else {
				autoSpin = true;
				autospin_input.setAttribute('checked', '');
			}
		};

		audio_input.onclick = function () {
			if (audioOn) {
				audioOn = false;
				audio_wheel.pause();
				audio_victory.pause();
			} else {
				audioOn = true;
			}
		};


		let instructionsBtn = document.createElement('div');
		instructionsBtn.setAttribute('class', 'instructionsBtn');
		instructionsBtn.onclick = function () {
			if (!container.querySelector('#instructions')) {
				instructions();
			}
		};
		let instructionsBtnSpan = document.createElement('span');
		instructionsBtnSpan.setAttribute('class', 'instructionsBtnSpan');
		instructionsBtnSpan.innerText = "INSTRUCCIONS";
		instructionsBtn.append(instructionsBtnSpan);
		container.append(instructionsBtn);

	}


	function buildWheel() {
		let wheel = document.createElement('div');
		wheel.setAttribute('class', 'wheel');

		let outerRim = document.createElement('div');
		outerRim.setAttribute('class', 'outerRim');
		wheel.append(outerRim);


		let numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
		for (i = 0; i < numbers.length; i++) {
			let a = i + 1;
			let spanClass = (numbers[i] < 10) ? 'single' : 'double';
			let sect = document.createElement('div');
			sect.setAttribute('id', 'sect' + a);
			sect.setAttribute('class', 'sect');
			let span = document.createElement('span');
			span.setAttribute('class', spanClass);
			span.innerText = numbers[i];
			sect.append(span);
			let block = document.createElement('div');
			block.setAttribute('class', 'block');
			sect.append(block);
			wheel.append(sect);
		}

		let pocketsRim = document.createElement('div');
		pocketsRim.setAttribute('class', 'pocketsRim');
		wheel.append(pocketsRim);

		let ballTrack = document.createElement('div');
		ballTrack.setAttribute('class', 'ballTrack');
		let ball = document.createElement('div');
		ball.setAttribute('class', 'ball');
		ballTrack.append(ball);
		wheel.append(ballTrack);

		let pockets = document.createElement('div');
		pockets.setAttribute('class', 'pockets');
		wheel.append(pockets);

		let cone = document.createElement('div');
		cone.setAttribute('class', 'cone');
		wheel.append(cone);

		let turret = document.createElement('div');
		turret.setAttribute('class', 'turret');
		wheel.append(turret);

		let turretHandle = document.createElement('div');
		turretHandle.setAttribute('class', 'turretHandle');


		let turretHandle2 = document.createElement('div');
		turretHandle2.setAttribute('class', 'turretHandle2');

		let thendOne = document.createElement('div');
		thendOne.setAttribute('class', 'thendOne');
		turretHandle.append(thendOne);

		let thendTwo = document.createElement('div');
		thendTwo.setAttribute('class', 'thendTwo');
		turretHandle.append(thendTwo);

		let thendThree = document.createElement('div');
		thendThree.setAttribute('class', 'thendThree');
		turretHandle2.append(thendThree);

		let thendFour = document.createElement('div');
		thendFour.setAttribute('class', 'thendFour');
		turretHandle2.append(thendFour);


		wheel.append(turretHandle);
		wheel.append(turretHandle2);

		container.append(wheel);
	}

	function buildBettingBoard() {
		let bettingBoard = document.createElement('div');
		bettingBoard.setAttribute('id', 'betting_board');

		let wl = document.createElement('div');
		wl.setAttribute('class', 'winning_lines');

		var wlttb = document.createElement('div');
		wlttb.setAttribute('id', 'wlttb_top');
		wlttb.setAttribute('class', 'wlttb');
		for (i = 0; i < 11; i++) {
			let j = i;
			var ttbbetblock = document.createElement('div');
			ttbbetblock.setAttribute('class', 'ttbbetblock');
			var numA = (1 + (3 * j));
			var numB = (2 + (3 * j));
			var numC = (3 + (3 * j));
			var numD = (4 + (3 * j));
			var numE = (5 + (3 * j));
			var numF = (6 + (3 * j));
			let num = numA + ', ' + numB + ', ' + numC + ', ' + numD + ', ' + numE + ', ' + numF;
			var objType = 'double_street';
			// IMPORTANT CLICK APOSTA EN TAULA
			ttbbetblock.onclick = function () {
				setBet(this, num, objType, 5);
			};
			ttbbetblock.oncontextmenu = function (e) {
				e.preventDefault();
				removeBet(this, num, objType, 5);
			};
			wlttb.append(ttbbetblock);
		}
		wl.append(wlttb);

		for (c = 1; c < 4; c++) {
			let d = c;
			var wlttb = document.createElement('div');
			wlttb.setAttribute('id', 'wlttb_' + c);
			wlttb.setAttribute('class', 'wlttb');
			for (i = 0; i < 12; i++) {
				let j = i;
				var ttbbetblock = document.createElement('div');
				ttbbetblock.setAttribute('class', 'ttbbetblock');
				ttbbetblock.onclick = function () {
					if (d == 1 || d == 2) {
						var numA = ((2 - (d - 1)) + (3 * j));
						var numB = ((3 - (d - 1)) + (3 * j));
						var num = numA + ', ' + numB;
					}
					else {
						var numA = (1 + (3 * j));
						var numB = (2 + (3 * j));
						var numC = (3 + (3 * j));
						var num = numA + ', ' + numB + ', ' + numC;
					}
					var objType = (d == 3) ? 'street' : 'split';
					var odd = (d == 3) ? 11 : 17;
					setBet(this, num, objType, odd);
				};
				ttbbetblock.oncontextmenu = function (e) {
					e.preventDefault();
					if (d == 1 || d == 2) {
						var numA = ((2 - (d - 1)) + (3 * j));
						var numB = ((3 - (d - 1)) + (3 * j));
						var num = numA + ', ' + numB;
					}
					else {
						var numA = (1 + (3 * j));
						var numB = (2 + (3 * j));
						var numC = (3 + (3 * j));
						var num = numA + ', ' + numB + ', ' + numC;
					}
					var objType = (d == 3) ? 'street' : 'split';
					var odd = (d == 3) ? 11 : 17;
					removeBet(this, num, objType, odd);
				};
				wlttb.append(ttbbetblock);
			}
			wl.append(wlttb);
		}

		for (c = 1; c < 12; c++) {
			let d = c;
			var wlrtl = document.createElement('div');
			wlrtl.setAttribute('id', 'wlrtl_' + c);
			wlrtl.setAttribute('class', 'wlrtl');
			for (i = 1; i < 4; i++) {
				let j = i;
				var rtlbb = document.createElement('div');
				rtlbb.setAttribute('class', 'rtlbb' + i);
				var numA = (3 + (3 * (d - 1))) - (j - 1);
				var numB = (6 + (3 * (d - 1))) - (j - 1);
				let num = numA + ', ' + numB;
				rtlbb.onclick = function () {
					setBet(this, num, 'split', 17);
				};
				rtlbb.oncontextmenu = function (e) {
					e.preventDefault();
					removeBet(this, num, 'split', 17);
				};
				wlrtl.append(rtlbb);
			}
			wl.append(wlrtl);
		}

		for (c = 1; c < 3; c++) {
			var wlcb = document.createElement('div');
			wlcb.setAttribute('id', 'wlcb_' + c);
			wlcb.setAttribute('class', 'wlcb');
			for (i = 1; i < 12; i++) {
				let count = (c == 1) ? i : i + 11;
				var cbbb = document.createElement('div');
				cbbb.setAttribute('id', 'cbbb_' + count);
				cbbb.setAttribute('class', 'cbbb');
				var numA = '2';
				var numB = '3';
				var numC = '5';
				var numD = '6';
				let num = (count >= 1 && count < 12) ? (parseInt(numA) + ((count - 1) * 3)) + ', ' + (parseInt(numB) + ((count - 1) * 3)) + ', ' + (parseInt(numC) + ((count - 1) * 3)) + ', ' + (parseInt(numD) + ((count - 1) * 3)) : ((parseInt(numA) - 1) + ((count - 12) * 3)) + ', ' + ((parseInt(numB) - 1) + ((count - 12) * 3)) + ', ' + ((parseInt(numC) - 1) + ((count - 12) * 3)) + ', ' + ((parseInt(numD) - 1) + ((count - 12) * 3));
				var objType = 'corner_bet';
				cbbb.onclick = function () {
					setBet(this, num, objType, 8);
				};
				cbbb.oncontextmenu = function (e) {
					e.preventDefault();
					removeBet(this, num, objType, 8);
				};
				wlcb.append(cbbb);
			}
			wl.append(wlcb);
		}

		bettingBoard.append(wl);

		let bbtop = document.createElement('div');
		bbtop.setAttribute('class', 'bbtop');
		let bbtopBlocks = ['1 to 18', '19 to 36'];
		for (i = 0; i < bbtopBlocks.length; i++) {
			let f = i;
			var bbtoptwo = document.createElement('div');
			bbtoptwo.setAttribute('class', 'bbtoptwo');
			let num = (f == 0) ? '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18' : '19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36';
			var objType = (f == 0) ? 'outside_low' : 'outside_high';
			bbtoptwo.onclick = function () {
				setBet(this, num, objType, 1);
			};
			bbtoptwo.oncontextmenu = function (e) {
				e.preventDefault();
				removeBet(this, num, objType, 1);
			};
			bbtoptwo.innerText = bbtopBlocks[i];
			bbtop.append(bbtoptwo);
		}
		bettingBoard.append(bbtop);

		let numberBoard = document.createElement('div');
		numberBoard.setAttribute('class', 'number_board');

		let zero = document.createElement('div');
		zero.setAttribute('class', 'number_0');
		var objType = 'zero';
		var odds = 35;
		zero.onclick = function () {
			setBet(this, '0', objType, odds);
		};
		zero.oncontextmenu = function (e) {
			e.preventDefault();
			removeBet(this, '0', objType, odds);
		};
		let nbnz = document.createElement('div');
		nbnz.setAttribute('class', 'nbn');
		nbnz.innerText = '0';
		zero.append(nbnz);
		numberBoard.append(zero);

		var numberBlocks = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, '2 to 1', 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, '2 to 1', 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, '2 to 1'];
		var redBlocks = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
		for (i = 0; i < numberBlocks.length; i++) {
			let a = i;
			var nbClass = (numberBlocks[i] == '2 to 1') ? 'tt1_block' : 'number_block';
			var colourClass = (redBlocks.includes(numberBlocks[i])) ? ' redNum' : ((nbClass == 'number_block') ? ' blackNum' : '');
			var numberBlock = document.createElement('div');
			numberBlock.setAttribute('class', nbClass + colourClass);
			numberBlock.onclick = function () {
				if (numberBlocks[a] != '2 to 1') {
					setBet(this, '' + numberBlocks[a] + '', 'inside_whole', 35);
				} else {
					num = (a == 12) ? '3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36' : ((a == 25) ? '2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35' : '1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34');
					setBet(this, num, 'outside_column', 2);
				}
			};
			numberBlock.oncontextmenu = function (e) {
				e.preventDefault();
				if (numberBlocks[a] != '2 to 1') {
					removeBet(this, '' + numberBlocks[a] + '', 'inside_whole', 35);
				} else {
					num = (a == 12) ? '3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36' : ((a == 25) ? '2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35' : '1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34');
					removeBet(this, num, 'outside_column', 2);
				}
			};
			var nbn = document.createElement('div');
			nbn.setAttribute('class', 'nbn');
			nbn.innerText = numberBlocks[i];
			numberBlock.append(nbn);
			numberBoard.append(numberBlock);
		}
		bettingBoard.append(numberBoard);

		let bo3Board = document.createElement('div');
		bo3Board.setAttribute('class', 'bo3_board');
		let bo3Blocks = ['1 to 12', '13 to 24', '25 to 36'];
		for (i = 0; i < bo3Blocks.length; i++) {
			let b = i;
			var bo3Block = document.createElement('div');
			bo3Block.setAttribute('class', 'bo3_block');
			bo3Block.onclick = function () {
				num = (b == 0) ? '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12' : ((b == 1) ? '13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24' : '25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36');
				setBet(this, num, 'outside_dozen', 2);
			};
			bo3Block.oncontextmenu = function (e) {
				e.preventDefault();
				num = (b == 0) ? '1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12' : ((b == 1) ? '13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24' : '25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36');
				removeBet(this, num, 'outside_dozen', 2);
			};
			bo3Block.innerText = bo3Blocks[i];
			bo3Board.append(bo3Block);
		}
		bettingBoard.append(bo3Board);

		let otoBoard = document.createElement('div');
		otoBoard.setAttribute('class', 'oto_board');
		let otoBlocks = ['EVEN', 'RED', 'BLACK', 'ODD'];
		for (i = 0; i < otoBlocks.length; i++) {
			let d = i;
			var colourClass = (otoBlocks[i] == 'RED') ? ' redNum' : ((otoBlocks[i] == 'BLACK') ? ' blackNum' : '');
			var otoBlock = document.createElement('div');
			otoBlock.setAttribute('class', 'oto_block' + colourClass);
			otoBlock.onclick = function () {
				num = (d == 0) ? '2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36' : ((d == 1) ? '1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36' : ((d == 2) ? '2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35' : '1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35'));
				setBet(this, num, 'outside_oerb', 1);
			};
			otoBlock.oncontextmenu = function (e) {
				num = (d == 0) ? '2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36' : ((d == 1) ? '1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36' : ((d == 2) ? '2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35' : '1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35'));
				e.preventDefault();
				removeBet(this, num, 'outside_oerb', 1);
			};
			otoBlock.innerText = otoBlocks[i];
			otoBoard.append(otoBlock);
		}
		bettingBoard.append(otoBoard);


		let chipDeck = document.createElement('div');
		chipDeck.setAttribute('class', 'chipDeck');
		// VALOR FITXES SELECTOR
		let chipValues = [1, 5, 10, 50, 100, 500, 'clear'];
		// let chipValues = [1, 5, 10, 50, 100, 500, 'clear'];
		for (i = 0; i < chipValues.length; i++) {
			let cvi = i;
			// COLOR FITXES SELECTOR
			let chipColour = (i == 0) ? 'green' : (i == 1) ? 'blue cdChipActive' : (i == 2) ? 'orange' : (i == 3) ? 'red' : (i == 4) ? 'gold'
				: (i == 5) ? 'purple' : 'clearBet';
			let chip = document.createElement('div');
			chip.setAttribute('class', 'cdChip ' + chipColour);


			chip.onclick = function () {
				if (cvi !== 6) {
					let cdChipActive = document.getElementsByClassName('cdChipActive');
					for (i = 0; i < cdChipActive.length; i++) {
						cdChipActive[i].classList.remove('cdChipActive');
					}
					let curClass = this.getAttribute('class');
					if (!curClass.includes('cdChipActive')) {
						this.setAttribute('class', curClass + ' cdChipActive');
					}
					wager = parseInt(chip.childNodes[0].innerText);
				}
				else {

					// IMPORTANT BOTO DE BORRAR (CLEAR)
					if (freezeClic == false) {
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
			chipSpan.innerText = chipValues[i];
			chip.append(chipSpan);
			chipDeck.append(chip);
		}
		bettingBoard.append(chipDeck);

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
		bettingBoard.append(bankContainer);

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


		let pnBlock = document.createElement('div');
		pnBlock.setAttribute('class', 'pnBlock');
		let pnContent = document.createElement('div');
		pnContent.setAttribute('id', 'pnContent');
		pnContent.onwheel = function (e) {
			e.preventDefault();
			pnContent.scrollLeft += e.deltaY;
		};
		pnBlock.append(pnContent);
		bettingBoard.append(pnBlock);

		container.append(bettingBoard);
	}



	function clearBet() {
		bet = [];
		numbersBet = [];
		console.log(bet);
		if (container.querySelector('.spinBtn')) {
			container.querySelector('.spinBtn').remove();
		}

	}

	function setBet(e, n, t, o) {
		lastWager = wager;
		wager = (bankValue < wager) ? bankValue : wager;
	

		if (wager > 0 && freezeClic == false) {
			if (audioOn) {
				audio_chip.play();
			}
			if (!container.querySelector('.spinBtn')) {
				let spinBtn = document.createElement('div');
				spinBtn.setAttribute('class', 'spinBtn');
				spinBtn.innerText = 'spin';
				spinBtn.onclick = function () {
					freezeClic = true;
					this.remove();
					spin();
				};
				container.append(spinBtn);
			}
			bankValue = bankValue - wager;
			// console.log('RESTA', bankValue, wager)
			currentBet = currentBet + wager;
			document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
			document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';


			// console.log('BET', bet)
			for (i = 0; i < bet.length; i++) {
				if (bet[i].numbers == n && bet[i].type == t) {
					bet[i].amt = bet[i].amt + wager;
					// COLOR FITXA TAULER
					let chipColour = (bet[i].amt < 5) ? 'green' : ((bet[i].amt < 10) ? 'blue' : ((bet[i].amt < 50) ? 'orange' : ((bet[i].amt < 100) ? 'red' : ((bet[i].amt < 500) ? 'gold' : 'purple'))));
					e.querySelector('.chip').style.cssText = '';
					e.querySelector('.chip').setAttribute('class', 'chip ' + chipColour);
					let chipSpan = e.querySelector('.chipSpan');
					if (String(bet[i].amt).length > 4) {
						chipSpan.innerText = String(bet[i].amt).substring(-4, 2) + "K";
					} else if (String(bet[i].amt).length == 4) {
						chipSpan.innerText = String(bet[i].amt).substring(-4, 1) + "K";
					} else {
						chipSpan.innerText = bet[i].amt;
					}

					let chipValuesBetText = e.querySelector('.tooltipBetText');/////////
					chipValuesBetText.innerText = bet[i].amt;	/////////////////////////////////////


					return;
				}
			}
			var obj = {
				amt: wager,
				type: t,
				odds: o,
				numbers: n
			};
			bet.push(obj);

			let numArray = n.split(',').map(Number);
			for (i = 0; i < numArray.length; i++) {
				if (!numbersBet.includes(numArray[i])) {
					numbersBet.push(numArray[i]);
				}
			}

			// CREAR CHIP
			if (!e.querySelector('.chip')) {
				let chipColour = (wager < 5) ? 'green' : ((wager < 10) ? 'blue' : ((wager < 50) ? 'orange' : ((wager < 100) ? 'red' : ((wager < 500) ? 'gold' : 'purple'))));
			
				// TEXT VALOR CHIPS TAULER
				let chipValuesBet = document.createElement('div');
				chipValuesBet.setAttribute('class', 'tooltip tooltipChipSpan');
				let chipValuesBetText = document.createElement('span');
				chipValuesBetText.setAttribute('class', 'tooltiptext tooltipBetText');
				chipValuesBet.append(chipValuesBetText);
				// chip.append(chipValuesText);


				let chip = document.createElement('div');
				chip.setAttribute('class', 'chip ' + chipColour);
				let chipSpan = document.createElement('span');
				chipSpan.setAttribute('class', 'chipSpan');
				chipSpan.innerText = wager;

				chipValuesBetText.innerText = wager;/////////
				chip.append(chipSpan);

				chip.append(chipValuesBet); /////////////////////////////////////////////////
				e.append(chip);
			}
		}
	}

	function spin() {
		var winningSpin = Math.floor(Math.random() * 36);
		spinWheel(winningSpin);
		setTimeout(function () {
			let winValue = 0;
			let betTotal = 0;
			if (numbersBet.includes(winningSpin)) {
				winValue = 0;
				betTotal = 0;
				for (i = 0; i < bet.length; i++) {
					var numArray = bet[i].numbers.split(',').map(Number);
					if (numArray.includes(winningSpin)) {
						bankValue = (bankValue + (bet[i].odds * bet[i].amt) + bet[i].amt);
						winValue = winValue + (bet[i].odds * bet[i].amt);
						betTotal = betTotal + bet[i].amt;
					}
				}
				win(winningSpin, winValue, betTotal);
			}

			document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
			lastBetValue = currentBet;
			//console.log('PROFIT',(winValue+betTotal)-currentBet);
			profitValue = (winValue + betTotal) - currentBet;
			document.getElementById('profitSpan').innerText = '' + profitValue.toLocaleString("en-GB") + '';

			if (!autoBet) {
				currentBet = 0;
				document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
			} else {
				// APLICAR LA RESTA DEL AUTOBET AL BANK
				if (bankValue - lastBetValue >= 0) {
					bankValue = bankValue - lastBetValue;
					document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
				} else {
					// RESET SI NO HI HA FITXES
					currentBet = 0;
					document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
				}
				// BOTO SPIN SI HI HA AUTOBET, AUTOSPIN I FITXES
				if (!container.querySelector('.spinBtn') && currentBet > 0 && !autoSpin) {
					let spinBtn = document.createElement('div');
					spinBtn.setAttribute('class', 'spinBtn');
					spinBtn.innerText = 'spin';
					spinBtn.onclick = function () {
						freezeClic = true;
						this.remove();
						spin();
					};
					container.append(spinBtn);
				}
			}

			document.getElementById('lastBetSpan').innerText = '' + lastBetValue.toLocaleString("en-GB") + '';

			let pnClass = (numRed.includes(winningSpin)) ? 'pnRed' : ((winningSpin == 0) ? 'pnGreen' : 'pnBlack');
			let pnContent = document.getElementById('pnContent');
			let pnSpan = document.createElement('span');
			pnSpan.setAttribute('class', pnClass);
			pnSpan.innerText = winningSpin;
			pnContent.append(pnSpan);
			pnContent.scrollLeft = pnContent.scrollWidth;

			if (!autoBet) {
				bet = [];
				numbersBet = [];
				removeChips();
				wager = lastWager;
			} else {		//AUTOBET COMPROVAR SI QUEDEN FITXES AL BANK
				if ((bankValue - lastBetValue) < 0) {
					bet = [];
					numbersBet = [];
					removeChips();
					wager = lastWager;
				}
			}


			if (autoSpin && currentBet > 0) {
				setTimeout(() => {
					freezeClic = true;
					if (container.querySelector('.spinBtn')) {
						container.querySelector('.spinBtn').remove();
					}
					spin();
				}, 4000);

			}
			// console.log('Last bet: ' + lastBetValue.toLocaleString("en-GB") + '');

			freezeClic = false;
		}, 10000);
	}

	function win(winningSpin, winValue, betTotal) {
		if (winValue > 0) {
			if (audioOn) {
				audio_victory.play();
			}
			let notification = document.createElement('div');
			notification.setAttribute('id', 'notification');
			let nSpan = document.createElement('div');
			nSpan.setAttribute('class', 'nSpan');
			let nsnumber = document.createElement('span');
			nsnumber.setAttribute('class', 'nsnumber');
			nsnumber.style.cssText = (numRed.includes(winningSpin)) ? 'color:red' : 'color:black';
			nsnumber.innerText = winningSpin;
			nSpan.append(nsnumber);
			let nsTxt = document.createElement('span');
			nsTxt.innerText = ' Win';
			nSpan.append(nsTxt);
			let nsWin = document.createElement('div');
			nsWin.setAttribute('class', 'nsWin');
			let nsWinBlock = document.createElement('div');
			nsWinBlock.setAttribute('class', 'nsWinBlock');
			nsWinBlock.innerText = 'Bet: ' + betTotal;
			nSpan.append(nsWinBlock);
			nsWin.append(nsWinBlock);
			nsWinBlock = document.createElement('div');
			nsWinBlock.setAttribute('class', 'nsWinBlock');
			nsWinBlock.innerText = 'Win: ' + winValue;
			nSpan.append(nsWinBlock);
			nsWin.append(nsWinBlock);
			nsWinBlock = document.createElement('div');
			nsWinBlock.setAttribute('class', 'nsWinBlock');
			nsWinBlock.innerText = 'Payout: ' + (winValue + betTotal);
			nsWin.append(nsWinBlock);
			nSpan.append(nsWin);
			notification.append(nSpan);
			container.prepend(notification);
			setTimeout(function () {
				notification.style.cssText = 'opacity:0';
			}, 3000);
			setTimeout(function () {
				notification.remove();
			}, 4000);
		}
	}

	function removeBet(e, n, t, o) {

		wager = (wager == 0) ? 100 : wager;
		for (i = 0; i < bet.length; i++) {
			if (bet[i].numbers == n && bet[i].type == t) {
				if (bet[i].amt != 0 && !freezeClic) {
					if (audioOn) {
						audio_pop.play();
					}
					wager = (bet[i].amt > wager) ? wager : bet[i].amt;
					bet[i].amt = bet[i].amt - wager;
					bankValue = bankValue + wager;
					currentBet = currentBet - wager;
					document.getElementById('bankSpan').innerText = '' + bankValue.toLocaleString("en-GB") + '';
					document.getElementById('betSpan').innerText = '' + currentBet.toLocaleString("en-GB") + '';
					if (bet[i].amt == 0) {
						e.querySelector('.chip').style.cssText = 'display:none';
					} else {
						// COLOR FITXES TAULER INICIAL
						// let chipColour = (bet[i].amt < 5)? 'red' : ((bet[i].amt < 10)? 'blue' : ((bet[i].amt < 100)? 'orange' : 'gold'));
						let chipColour = (bet[i].amt < 5) ? 'green' : ((bet[i].amt < 10) ? 'blue' : ((bet[i].amt < 50) ? 'orange' : ((bet[i].amt < 100) ? 'red' : ((bet[i].amt < 500) ? 'gold' : 'purple'))));

						e.querySelector('.chip').setAttribute('class', 'chip ' + chipColour);
						let chipSpan = e.querySelector('.chipSpan');
						if (String(bet[i].amt).length > 4) {
							chipSpan.innerText = String(bet[i].amt).substring(-4, 2) + "K";
						} else if (String(bet[i].amt).length == 4) {
							chipSpan.innerText = String(bet[i].amt).substring(-4, 1) + "K";
						} else {
							chipSpan.innerText = bet[i].amt;
						}

						let chipValuesBetText = e.querySelector('.tooltipBetText');/////////
						chipValuesBetText.innerText = bet[i].amt;
					}
				}
			}
		}


		// DESAPAREXIER EL BOTO SPIN
		if (currentBet == 0 && container.querySelector('.spinBtn')) {
			document.getElementsByClassName('spinBtn')[0].remove();
		}
	}

	function spinWheel(winningSpin) {
		if (audioOn) {
			audio_wheel.play();
		}

		for (i = 0; i < wheelnumbersAC.length; i++) {
			if (wheelnumbersAC[i] == winningSpin) {
				var degree = (i * 9.73) + 362;
			}
		}
		wheel.style.cssText = 'animation: wheelRotate 5s linear infinite;';
		ballTrack.style.cssText = 'animation: ballRotate 1s linear infinite;';

		setTimeout(function () {
			ballTrack.style.cssText = 'animation: ballRotate 2s linear infinite;';
			style = document.createElement('style');
			style.type = 'text/css';
			style.innerText = '@keyframes ballStop {from {transform: rotate(0deg);}to{transform: rotate(-' + degree + 'deg);}}';
			document.head.appendChild(style);
		}, 2000);
		setTimeout(function () {
			ballTrack.style.cssText = 'animation: ballStop 3s linear;';
		}, 6000);
		setTimeout(function () {
			ballTrack.style.cssText = 'transform: rotate(-' + degree + 'deg);';
		}, 9000);
		// setTimeout(function(){
		// 	// wheel.style.cssText = '';

		// 	wheel.style.cssText = 'animation: wheelRotate 3s ease-out ;';
		// 	// wheel.style.cssText = 'transform:rotate(359deg); transition: transform 3s ease-out;';
		// 	// style.remove();
		// }, 13000);
		setTimeout(function () {
			wheel.style.cssText = '';
			style.remove();
		}, 10000);
	}

	function removeChips() {
		var chips = document.getElementsByClassName('chip');
		if (chips.length > 0) {
			for (i = 0; i < chips.length; i++) {
				chips[i].remove();
			}
			removeChips();
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

		close_div.onclick = function () {
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

		let taulaInt = `<table>
					<tbody>
					<tr align="center"><th colspan="3" align="center"><strong>Apostes internes</strong></th></tr>
					<tr><th><strong>Nom de l'aposta</strong></th><th><strong>Numeros coberts</strong></th><th><strong>Relació de pagaments</strong></th></tr>
					<tr>
					<td>Ple</td>
					<td>1</td>
					<td>35 a 1</td>
					</tr>
					<tr>
					<td>Semiple</td>
					<td>2</td>
					<td>17 a 1</td>
					</tr>
					<tr>
					<td>Carrer</td>
					<td>3</td>
					<td>11 a 1</td>
					</tr>
					<tr>
					<td>Quadre</td>
					<td>4</td>
					<td>8 a 1</td>
					</tr>
					<tr>
					<td>Línia</td>
					<td>6</td>
					<td>5 a 1</td>
					</tr>
					</tbody>
					</table>`;

		let taulaExt = `
					<br>
					<table>
					<tbody>
					<tr><th colspan="3"><strong>Apostes externes</strong></th></tr>
					<tr><th><strong>Nom de l'aposta</strong></th><th><strong>Numeros coberts</strong></th><th><strong>Relació de pagaments</strong></th></tr>
					<tr>
					<td>Vermell</td>
					<td>18</td>
					<td>1 a 1</td>
					</tr>
					<tr>
					<td>Negre</td>
					<td>18</td>
					<td>1 a 1</td>
					</tr>
					<tr>
					<td>Senar</td>
					<td>18</td>
					<td>1 a 1</td>
					</tr>
					<tr>
					<td>Parell</td>
					<td>18</td>
					<td>1 a 1</td>
					</tr>
					<tr>
					<td>Falta (1-18)</td>
					<td>18</td>
					<td>1 a 1</td>
					</tr>
					<tr>
					<td>Passa (19-36)</td>
					<td>18</td>
					<td>1 a 1</td>
					</tr>
					<tr>
					<td>1.ª, 2.ª o 3.ª dotzena</td>
					<td>12</td>
					<td>2 a 1</td>
					</tr>
					<tr>
					<td>1.ª, 2.ª o 3.ª columna</td>
					<td>12</td>
					<td>2 a 1</td>
					</tr>
					</tbody>
					</table>`;

		let instructionsTxt = document.createElement('span');
		instructionsTxt.setAttribute('class', 'instructionsTxt');
		instructionsTxt.innerHTML = `
					Tot i que aquest joc és gratis i no es juga amb diners reals, recorda:<br>
					<h3>JUGA AMB RESPONSABILITAT</h3>
					<br>
					Per <strong>apostar</strong> sel·lecciona la fitxa que vulguis i col·loca les apostes on prefereixis.<br>
					Amb <strong>click dret</strong> restes el valor de la fitxa a l'aposta.<br>
					<strong>Exemple</strong>: Tinc 555 fitxes apostades al negre, si tinc la fitxa de 50 sel·lecionada i faig click dret sobre el negre, 
					es restarà 50 a aquella aposta i quedarà 505. <br><br>
					El botó <strong>clear</strong> elimina totes les apostes.
					<br><br>
					Un cop tinguis les apostes, fes click al botó <strong>spin</strong> per girar la ruleta.<br>
					L'historial de resultats es mostra sota del tauler (a la dreta el mes recent).
					<br><br>
					<strong>CONFIGURACIÓ DE JOC</strong><br>
					<strong>AUTOBET</strong>: Manté l'aposta sobre el tauler per les següents tirades.<br>
					<strong>AUTOSPIN</strong>: Si hi ha apostes en el tauler, es tirarà de la ruleta automaticament amb un marge de 4 segons entre tirades.<br>
					<strong>AUDIO</strong>: Activa o desactiva els efectes de so.<br>
					<br><br>
					<strong>ECONOMIA</strong><br>
					<strong>TOKENS</strong>: El teu saldo de tokens actual.<br>
					<strong>CURRENT BET</strong>: El total de les apostes que hi ha actualment en el tauler.<br>
					<strong>LAST BET</strong>: El total de les apostes de la tirada anterior.<br>
					<strong>LAST PROFIT</strong>: Els guanys / pèrdues de la tirada anterior.
					<br><br>
					A continuació es mostren les <strong>relacions de pagament</strong>:
					<br><br>
					`;

		let instructionsTaulaInt = document.createElement('div');
		instructionsTaulaInt.setAttribute('class', 'instructionsTaulaInt');
		instructionsTaulaInt.innerHTML = taulaInt;
		let instructionsTaulaExt = document.createElement('div');
		instructionsTaulaExt.setAttribute('class', 'instructionsTaulaExt');
		instructionsTaulaExt.innerHTML = taulaExt;

		instructions_div.append(instructionsTxt, instructionsTaulaInt, instructionsTaulaExt);

		instructions.append(close_div, instructions_div);
		container.prepend(instructions);

	}