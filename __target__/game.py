from itertools import chain
from random import shuffle
import random

# Install JS compiler:
# python3 -m pip install transcrypt

# Compile to JS:
# python3 -m transcrypt -b -m -n game.py

class Quadzilla:

    def __init__ (self):
        self.setup()

    def setup (self):
        suits = ["H","D","S","C"]
        ranks = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
        self.deck = []
        self.stack = []
        self.message = ""
        self.moving_card = [[], 0] # [card, col]
        self.moves_left = 3
        self.trump = ranks[random.randint(0, len(ranks)-1)]
        for suit in suits:
        	for rank in ranks:
        		self.deck.append([rank, suit])
        for e in range(5):
        	self.stack.append([])

    def restore (self, data):
        self.deck = data.deck
        self.stack = data.stack
        self.moves_left = data.moves_left
        self.trump = data.trump

    def start_move (self, card, col):
#        if "".join(card) == "".join(self.moving_card[0]):
        if card.join("") == self.moving_card[0].join(""):
            self.moving_card = [[], 0]
        else:
            self.moving_card = [card, col]

    #def can_move_to_col (self, card, tocol):
    #	cardlocation =[]

    def move (self, card, tocol):
    	cardlocation =[]
    	for e in enumerate(self.stack):
#    		tmp = map(lambda x: "".join(x), e[1])
    		tmp = map(lambda x: x.join(""), e[1])
#    		if card in e[1]:
#    		if "".join(card) in tmp:
    		if card.join("") in tmp:
    			cardlocation.append(e[0])
    			cardlocation.append(tmp.index(card.join("")))
#    			cardlocation.append(tmp.index("".join(card)))
    	if cardlocation[0] == tocol or len(cardlocation) == 0:
    		self.message = "illegal move sucka"
    		return 0
    	while len(self.stack[cardlocation[0]]) > cardlocation[1]:
    		self.stack[int(tocol)].append(self.stack[cardlocation[0]].pop(cardlocation[1]))
    	self.moves_left += -1
    	self.moving_card = [[], 0]

    def score (self, scorecol):
    	for i in range(4): self.stack[0].append(self.stack[int(scorecol)].pop())
    	self.moves_left += 1

    def turn_deal (self):
    	self.moves_left = 3
    	for e in self.stack[1:]:
    		e.append(self.deck.pop())

    def game_start (self):
    	shuffle(self.deck)
    	self.turn_deal()

quadzilla = Quadzilla ()
