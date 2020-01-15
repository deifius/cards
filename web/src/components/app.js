import * as game from '../../../__target__/game.js';
import { h, Component } from 'preact';

const { solatare } = game;

export default class App extends Component {

	constructor() {
		super();
		solatare.game_start();
		this.state = { ...solatare };
	}

	update() {
		this.setState({
			...solatare
		});
	}

	deal() {
		solatare.turn_deal();
		this.update();
	}

	click_card(card) {
		// console.log("click", card);
		solatare.start_move(card);
		this.update();
	}

	move(card, colnum) {
		// console.log("move", card, colnum);
		solatare.move(card, colnum);
		this.update();
	}

	score(colnum) {
		// console.log("score", colnum);
		solatare.score(colnum);
		this.update();
	}

	col_can_score(colnum) {
		const col = this.state.stack[colnum];
		const { trump } = this.state;
		if(col.length < 4) return false;
		const last4 = col.slice(-4)
		let suit = false;
		let trumpcount = 0;
		const suitmismatch = last4.some(card => {
			const c_face = card.slice(0, -1);
			const c_suit = card.slice(   -1);
			if(!suit) suit = c_suit;
			if(c_face === trump) {
				trumpcount++;
				return false;
			}
			return (c_suit !== suit);
		});
		if(trumpcount === 4) return true;
		if(suitmismatch || trumpcount > 0) return false;
		return true;
	}

	render() {
		const { deck, message, moves_left, moving_card, stack, trump } = this.state;
		// console.log("state", state);
		// console.log("stack", JSON.stringify(state.stack));
		return (
			<div id="app">
				<div class="row">
				{
					stack.map((cards, colnum) => (
						!!colnum && <div class="column">
						{
							cards.map((card, n) => {
								const clickable = moves_left > 0;
								const selected = moving_card === card;
								const cardClass = `card card-${card}`;
								const cardProps = {
									className: `${cardClass} ${clickable ? "clickable" : ""} ${selected ? "selected" : ""}`,
									onClick: () => clickable && this.click_card(card),
								}
								return <div {...cardProps} />
							})
						}
						{
							moving_card !== ""
							&& !cards.includes(moving_card)
							&& (
								<div className="target" onClick={() => this.move(moving_card, colnum)} />
							)
						}
						{
							this.col_can_score(colnum) && <button onClick={e => this.score(colnum)} {...{ disabled: moving_card !== "" }}>score</button>
						}
						</div>
					))
				}
				</div>
				<div>left in deck: {deck.length}</div>
				<div>moves left: {moves_left}</div>
				<div>the trump card is: {trump}</div>
				{/*<div>score pile? {state.stack[0].join(",")}</div>*/}
				<div id="message">{message}</div>

				{deck.length && <button onClick={e => this.deal()} {...{ disabled: moving_card !== "" }}>deal</button>}
				{deck.length === 0 && moves_left <= 0 && stack[0].length < 52 && <div>game over</div>}
				{stack[0].length === 52 && <div>you win!</div>}
			</div>
		);
	}
}
