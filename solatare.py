#!/usr/bin/env python3

from random import shuffle
from os import system
import random
import texttable as tt
import pdb

suits = ["D","H","C","S"]
ranks = ["2","3","4",'5','6','7','8','9','10',"J","Q","K","A"]

deck = []
for suit in suits:
	for rank in ranks:
		deck.append(rank + suit)

col1 = []
col2 = []
col3 = []
col4 = []

moves_left = 0
trump = ranks[random.randint(0,len(ranks))]

def table_show ():
	system('clear')
	tab = tt.Texttable()
	bigcol = max(len(col1),len(col2),len(col3),len(col4))
	for col in (col1, col2, col3, col4):
		while len(col) < bigcol: col.append(' ')
	for row in zip(col1, col2, col3, col4):
		tab.add_row(row)
	s = tab.draw()
	print(s)
	for col in (col1, col2, col3, col4):
		while ' ' in col: col.remove(' ')
	print("left in deck: " + str(len(deck)))
	print("moves left: " + str(moves_left))
	print('the trump card is: ' + trump)

def turn_deal():
	col1.append(deck.pop())
	col2.append(deck.pop())
	col3.append(deck.pop())
	col4.append(deck.pop())
	global moves_left
	moves_left = 3
	table_show()

def move(fromcol, tocol):
	tocol.append(fromcol.pop())
	global moves_left
	moves_left += -1
	table_show()

def score(scorecol):
	for i in range(4): scorecol.pop()
	global moves_left
	moves_left += 1
	table_show()

def game_start():
	shuffle(deck)
	#pdb.set_trace()
	turn_deal()
	global moves_left
	while True:
		while moves_left:
			pdb.set_trace()
			#fromcol = input("what column do you want to move from? ")
			#tocol = input("what column do you want to move to? ")
			#print(fromcol)
			#print(tocol)
			#move(fromcol, tocol)
		turn_deal()

game_start()
