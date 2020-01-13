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
		solatare.score();
		this.update();
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
		// TODO
		return this.state.stack[colnum].length >= 4;
	}

	render() {
		const { state } = this;
		// console.log("state", state);
		console.log("stack", JSON.stringify(state.stack));
		return (
			<div id="app">
				<div class="row">
				{
					state.stack.map((cards, colnum) => (
						!!colnum && <div class="column">
						{
							cards.map((card, n) => {
								const selected = state.moving_card === card;
								const cardProps = {
									className: `card clickable ${selected ? "selected" : ""}`,
									onClick: () => this.click_card(card),
								}
								return (
									<div {...cardProps}>
										<img src={`/assets/cards/${card}.PNG`} />
									</div>
								)
							})
						}
						{
							state.moving_card !== ""
							&& !cards.includes(state.moving_card)
							&& (
								<div className="target" onClick={() => this.move(state.moving_card, colnum)} />
							)
						}
						{
							this.col_can_score(colnum) && <button onClick={e => this.score(colnum)} {...{ disabled: state.moving_card !== "" }}>score</button>
						}
						</div>
					))
				}
				</div>
				<div>left in deck: {state.deck.length}</div>
				<div>moves left: {state.moves_left}</div>
				<div>the trump card is: {state.trump}</div>
				{/*<div>score pile? {state.stack[0].join(",")}</div>*/}
				<div id="message">{state.message}</div>

				<button onClick={e => this.deal()} {...{ disabled: state.moving_card !== "" }}>deal</button>
			</div>
		);
	}
}
