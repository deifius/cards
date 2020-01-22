import * as game from '../../../__target__/game.js';
import localforage from "localforage";
import { h, Component } from 'preact';
import clsx from "clsx";

const { quadzilla } = game;

const GAME_STATE = "qz_game_state";
const UNDO_STACK = "qz_undo_stack";

export default class App extends Component {

	constructor() {
		super();
		this.state = { ...quadzilla };
		localforage.getItem(GAME_STATE, (err, json) => {
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
		localforage.setItem(UNDO_STACK, [], () => {
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
		localforage.setItem(GAME_STATE, this.retrieve_state());
	}

	persist_undo(and_then) {
		localforage.getItem(UNDO_STACK, (err, undo_stack) => {
			if(!undo_stack || !undo_stack.length) undo_stack = [];
			undo_stack.push(this.retrieve_state());
			localforage.setItem(UNDO_STACK, undo_stack, and_then);
		});
	}

	update() {
		this.setState({...quadzilla});
		this.persist_state();
	}

	undo() {
		localforage.getItem(UNDO_STACK, (err, undo_stack) => {
			if(!err && undo_stack && undo_stack.length) {
				const prev_state = undo_stack.pop();
				localforage.setItem(UNDO_STACK, undo_stack, () => {
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

	click_card(card, col) {
		quadzilla.start_move(card, col);
		this.update();
	}

	move(col) {
		const { moving_card } = this.state;
		if(moving_card[1] === col) return;
		this.persist_undo(() => {
			quadzilla.move(moving_card[0], col);
			this.update();
		})
	}

	score(col) {
		this.persist_undo(() => {
			quadzilla.score(col);
			this.update();
		});
	}

	attempt_score(col) {

	}

	can_move_to(col) {
		const { moving_card, stack } = this.state;
		if(moving_card[0].length === 0) return false;
		if(moving_card[1] === col)      return false;
		if(stack[col].length === 0)     return true;
		return stack[col].slice(-1)[0][1] === moving_card[0][1];
	}

	col_can_score(colnum) {
		const col = this.state.stack[colnum];
		const { trump } = this.state;
		if(col.length < 4) return false;
		const last4 = col.slice(-4)
		let suit = false;
		let trumpcount = 0;
		const suitmismatch = last4.some(card => {
			if(!suit) suit = card[1];
			if(card[0] === trump) {
				trumpcount++;
				return false;
			}
			return (card[1] !== suit);
		});
		if(trumpcount === 4) return true;
		if(suitmismatch || trumpcount > 0) return false;
		return true;
	}

	render() {
		const { deck, message, moves_left, moving_card, stack, trump } = this.state;
		const play_again = <button onClick={() => this.restart()}>play again</button>;
		const moving_card_str = moving_card[0].join("");
		// console.log("state", this.state);
		return (
			<div id="app">
				<div class="row">
				{
					stack.map((cards, col) => (
						!!col && <div class="column" key={col}>
						{
							cards.map((card, n) => {
								if(!card || !card.length) return null;
								const card_str = card.join("");
								const clickable = moves_left > 0;
								const selected = moving_card_str === card_str;
								const card_props = {
									key: `${col}-${n}`,
									className: clsx("card", `card-${card_str}`, { clickable, selected, trump: card[1] === trump }),
									onClick: () => clickable && this.click_card(card, col),
									//onMouseDown: (e) => clickable && this.drag_start(card, e.target),
								}
								return <div {...card_props} />
							})
						}
						{
							this.can_move_to(col)
							&& (
								<div className="target" onClick={() => this.move(col)} />
							)
						}
						{
							this.col_can_score(col)
							&& (
								<button onClick={e => this.score(col)} {...{ disabled: moving_card_str !== "" }}>
									score
								</button>
							)
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
				{!!deck.length && (
					<button onClick={e => this.deal()} {...{ disabled: moving_card_str !== "" }}>
						deal
					</button>
				)}
				{deck.length === 0 && moves_left <= 0 && stack[0].length < 52 && (
					<div>
						game over
						<br />
						{play_again}
					</div>
				)}
				{stack[0].length === 52 && (
					<div>
						you win!
						<br />
						{play_again}
					</div>
				)}
			</div>
		);
	}
}
