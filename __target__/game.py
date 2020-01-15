from itertools import chain
from random import shuffle
import random

# Install JS compiler:
# python3 -m pip install transcrypt

# Compile to JS:
# python3 -m transcrypt -b -m -n game.py

class Solatare:

    def __init__ (self):
        suits = ["H","D","S","C"]
        ranks = ["A","2","3","4",'5','6','7','8','9','10',"J","Q","K"]
        self.deck = []
        self.stack = []
        self.message = ""
        self.moving_card = ""
        self.moves_left = 3
        self.trump = ranks[random.randint(0,len(ranks))]
        for suit in suits:
        	for rank in ranks:
        		self.deck.append(rank + suit)
        for e in range(5): self.stack.append([])

    def start_move (self, card):
        if card == self.moving_card:
            self.moving_card = ""
        else:
            self.moving_card = card

    def move (self, card, tocol):
    	cardlocation =[]
    	for e in enumerate(self.stack):
    		if card in e[1]:
    			cardlocation.append(e[0])
    			cardlocation.append(e[1].index(card))
    	if cardlocation[0] == tocol or cardlocation == []:
    		self.message = "illegal move sucka"
    		return 0
    	while len(self.stack[cardlocation[0]]) > cardlocation[1]:
    		self.stack[int(tocol)].append(self.stack[cardlocation[0]].pop(cardlocation[1]))
    	self.moves_left += -1
    	self.moving_card = ""

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

solatare = Solatare ()
