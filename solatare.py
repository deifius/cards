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

stack = [] # stack0 is the discard pile, stacks 1-4 are the stacks
for e in range(5): stack.append([])


moves_left = 0
trump = ranks[random.randint(0,len(ranks))]


def table_show ():
	system('clear')
	tab = tt.Texttable()
	bigcol = max(len(stack[1]),len(stack[2]),len(stack[3]),len(stack[4]))
	for col in (stack[1], stack[2], stack[3], stack[4]):
		while len(col) < bigcol: col.append(' ')
	for row in zip(stack[1], stack[2], stack[3], stack[4]):
		tab.add_row(row)
	s = tab.draw()
	print(s)
	for col in (stack[1], stack[2], stack[3], stack[4]):
		while ' ' in col: col.remove(' ')
	print("left in deck: " + str(len(deck)))
	print("moves left: " + str(moves_left))
	print('the trump card is: ' + trump)

def turn_deal():
	stack[1].append(deck.pop())
	stack[2].append(deck.pop())
	stack[3].append(deck.pop())
	stack[4].append(deck.pop())
	global moves_left
	moves_left = 3
	table_show()

def move(fromcol, tocol):
	tocol.append(fromcol.pop())
	global moves_left
	moves_left += -1
	table_show()

def score(scorecol):
	for i in range(4): stack[0].append(scorecol.pop())
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
				if scorecol == "1":  score(stack[1])
				if scorecol == "2":  score(stack[2])
				if scorecol == "3":  score(stack[3])
				if scorecol == "4":  score(stack[4])
			elif action == "move" or action == "1" or action == 'm':
				fromcol = input('which column do you want to move from? ')
				tocol = input('which column do you want to move to? ')
				if fromcol == "1":
					if tocol == "2":  move(stack[1], stack[2])
					if tocol == "3":  move(stack[1], stack[3])
					if tocol == "4":  move(stack[1], stack[4])
				if fromcol == "2":
					if tocol == "1":  move(stack[2], stack[1])
					if tocol == "3":  move(stack[2], stack[3])
					if tocol == "4":  move(stack[2], stack[4])
				if fromcol == "3":
					if tocol == "2":  move(stack[3], stack[2])
					if tocol == "1":  move(stack[3], stack[1])
					if tocol == "4":  move(stack[3], stack[4])
				if fromcol == "4":
					if tocol == "2":  move(stack[4], stack[2])
					if tocol == "3":  move(stack[4], stack[3])
					if tocol == "1":  move(stack[4], stack[1])
			else:
				print("not a legitimate move son!");
				sleep(4)
		turn_deal()
		pdb.set_trace()

game_start()
