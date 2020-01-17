// Transcrypt'ed from Python, 2020-01-16 23:35:53
var random = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_random__ from './random.js';
__nest__ (random, '', __module_random__);
import {shuffle} from './random.js';
import {chain} from './itertools.js';
var __name__ = '__main__';
export var Solatare =  __class__ ('Solatare', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self.setup ();
	});},
	get setup () {return __get__ (this, function (self) {
		var suits = ['H', 'D', 'S', 'C'];
		var ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		self.deck = [];
		self.stack = [];
		self.message = '';
		self.moving_card = '';
		self.moves_left = 3;
		self.trump = ranks [random.randint (0, len (ranks) - 1)];
		for (var suit of suits) {
			for (var rank of ranks) {
				self.deck.append (rank + suit);
			}
		}
		for (var e = 0; e < 5; e++) {
			self.stack.append ([]);
		}
	});},
	get restore () {return __get__ (this, function (self, data) {
		self.deck = data.deck;
		self.stack = data.stack;
		self.moves_left = data.moves_left;
		self.trump = data.trump;
	});},
	get start_move () {return __get__ (this, function (self, card) {
		if (card == self.moving_card) {
			self.moving_card = '';
		}
		else {
			self.moving_card = card;
		}
	});},
	get move () {return __get__ (this, function (self, card, tocol) {
		var cardlocation = [];
		for (var e of enumerate (self.stack)) {
			if (__in__ (card, e [1])) {
				cardlocation.append (e [0]);
				cardlocation.append (e [1].index (card));
			}
		}
		if (cardlocation [0] == tocol || cardlocation == []) {
			self.message = 'illegal move sucka';
			return 0;
		}
		while (len (self.stack [cardlocation [0]]) > cardlocation [1]) {
			self.stack [int (tocol)].append (self.stack [cardlocation [0]].py_pop (cardlocation [1]));
		}
		self.moves_left--;
		self.moving_card = '';
	});},
	get score () {return __get__ (this, function (self, scorecol) {
		for (var i = 0; i < 4; i++) {
			self.stack [0].append (self.stack [int (scorecol)].py_pop ());
		}
		self.moves_left++;
	});},
	get turn_deal () {return __get__ (this, function (self) {
		self.moves_left = 3;
		for (var e of self.stack.__getslice__ (1, null, 1)) {
			e.append (self.deck.py_pop ());
		}
	});},
	get game_start () {return __get__ (this, function (self) {
		shuffle (self.deck);
		self.turn_deal ();
	});}
});
export var solatare = Solatare ();

//# sourceMappingURL=game.map