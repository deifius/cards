#!/usr/bin/env python

from random import shuffle
import json

class deck:

	def __init__ (self):
		self.setup()

	def setup (self):
		self.deck = []
		self.stack = []
		self.message = ""
		with open('deck_list.json') as ranks:
			self.stack = json.loads(ranks.read())

	def show (self):
		return self.stack

	def draw (self):
		return self.stack.pop(0)

	def shuffle (self):
		return shuffle(self.stack) 

	def cut (self, topcut):
		self.stack = self.stack[topcut:] + self.stack[0:topcut]

	def push_top (self, card):
		self.stack.insert(0,card)

	def push_bottom (self, card):
		self.stack.append(card)

	def draw_bottom (self):
		return self.stack.pop()

	def reveal_top_x (self, x):
		return self.stack[0:x]

	def reveal_bottom_x (self, x):
		return self.stack[len(self.stack)-x:]
