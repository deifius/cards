#!/usr/bin/env python3

from random import shuffle
from os import system
import random
import texttable as tt
import pdb
from time import sleep

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
			#pdb.set_trace()
			action = input("1)move or 2)score or 3)deal? ")
			if action == "deal" or action == "3" or action == 'd':
				turn_deal()
			elif action == "score" or action == "2" or action == 's':
				scorecol = input('Which stack are you scoring? ')
				if scorecol == "1":  score(col1)
				if scorecol == "2":  score(col2)
				if scorecol == "3":  score(col3)
				if scorecol == "4":  score(col4)
			elif action == "move" or action == "1" or action == 'm':
				fromcol = input('which column do you want to move from? ')
				tocol = input('which column do you want to move to? ')
				if fromcol == "1":
					if tocol == "2":  move(col1, col2)
					if tocol == "3":  move(col1, col3)
					if tocol == "4":  move(col1, col4)
				if fromcol == "2":
					if tocol == "1":  move(col2, col1)
					if tocol == "3":  move(col2, col3)
					if tocol == "4":  move(col2, col4)
				if fromcol == "3":
					if tocol == "2":  move(col3, col2)
					if tocol == "1":  move(col3, col1)
					if tocol == "4":  move(col3, col4)
				if fromcol == "4":
					if tocol == "2":  move(col4, col2)
					if tocol == "3":  move(col4, col3)
					if tocol == "1":  move(col4, col1)
			else:
				print("not a legitimate move son!");
				sleep(4)
		turn_deal()

game_start()
