import * as game from '../../../__target__/game.js';
import localforage from "localforage";
import { h, Component } from 'preact';

const { quadzilla } = game;

export default class App extends Component {

	constructor() {
		super();
		this.state = { ...quadzilla };
		localforage.getItem("game_state", (err, json) => {
			if(json) {
				quadzilla.restore(json);
			} else {
				this.start()
			}
			this.update();
		})
	}

	start() {
		quadzilla.game_start();
	}

	restart() {
		quadzilla.setup();
		quadzilla.game_start();
		localforage.setItem("undo_stack", [], () => {
			this.update();
		})
	}

	retrieve_state() {
		const {
			stack,
			deck,
			trump,
			moves_left,
		} = quadzilla;
		return {
			stack,
			deck,
			trump,
			moves_left,
		};
	}

	persist_state() {
		localforage.setItem("game_state", this.retrieve_state());
	}

	persist_undo(and_then) {
		localforage.getItem("undo_stack", (err, undo_stack) => {
			if(!undo_stack || !undo_stack.length) undo_stack = [];
			undo_stack.push(this.retrieve_state());
			localforage.setItem("undo_stack", undo_stack, and_then);
		});
	}

	update() {
		this.setState({...quadzilla});
		this.persist_state();
	}

	undo() {
		localforage.getItem("undo_stack", (err, undo_stack) => {
			if(!err && undo_stack && undo_stack.length) {
				const prev_state = undo_stack.pop();
				localforage.setItem("undo_stack", undo_stack, () => {
					quadzilla.restore(prev_state);
					this.setState({...quadzilla});
					this.persist_state();
				});
			}
		});
	}

	deal() {
		this.persist_undo(() => {
			quadzilla.game_start();
			this.update();
		})
	}

	drag_start(card, div) {
		//console.log(card, div);
	}

	click_card(card) {
		quadzilla.start_move(card);
		this.update();
	}

	move(card, colnum) {
		this.persist_undo(() => {
			quadzilla.move(card, colnum);
			this.update();
		})
	}

	score(colnum) {
		this.persist_undo(() => {
			quadzilla.score(colnum);
			this.update();
		});
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
		const play_again = <button onClick={() => this.restart()}>play again</button>;
		// console.log("state", state);
		// console.log("stack", JSON.stringify(state.stack));
		return (
			<div id="app">
				<div class="row">
				{
					stack.map((cards, colnum) => (
						!!colnum && <div class="column" key={colnum}>
						{
							cards.map((card, n) => {
								if(!card) return null;
								const clickable = moves_left > 0;
								const selected = moving_card === card;
								const istrump = card.slice(0, -1) === trump;
								const cardClass = `card card-${card} ${istrump ? "trump" : ""}`;
								const cardProps = {
									key: `${colnum}-${n}`,
									className: `${cardClass} ${clickable ? "clickable" : ""} ${selected ? "selected" : ""}`,
									onClick: () => clickable && this.click_card(card),
									//onMouseDown: (e) => clickable && this.drag_start(card, e.target),
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

				<button onClick={e => this.undo()}>undo</button>
				{!!deck.length && <button onClick={e => this.deal()} {...{ disabled: moving_card !== "" }}>deal</button>}
				{deck.length === 0 && moves_left <= 0 && stack[0].length < 52 && <div>game over<br />{play_again}</div>}
				{stack[0].length === 52 && <div>you win!<br />{play_again}</div>}
			</div>
		);
	}
}
