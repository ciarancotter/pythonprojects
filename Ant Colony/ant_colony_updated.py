"""
Project Overview: Ant Simulation

This project simulates the behaviour of an ant. The ants spawn at the nest (which is randomly placed) and wander around until
they die. They produce offspring to keep the anthill going. This is the prototype, I intend to add the mechanics for pheremone placement
to and from a food source to fully simulate the Ant Colony Optimisation method to (hopefully) a basic level.

"""

#Importing shtuff
import pygame as pg
import sys
import random
import time
import matplotlib.pyplot as plt
from pygame.locals import *

#initialising pygame
screen = (400, 300)
pg.init()
myDisplay = pg.display.set_mode(screen)
immutable = pg.Surface(screen)
pg.display.set_caption('The Great Ant Colony')
reproductionNumber = 49
colony = []

#Variables that can be adjusted!
population = 100
delay = 0.05

#matplotlib
populationData = []
#the nest object
class Nest:
  def __init__(self):
    self.xpos = random.randint(100, 300)
    self.ypos = random.randint(100, 300)
    pg.draw.rect(myDisplay, (255, 255, 255), pg.Rect(self.xpos, self.ypos, 20, 20))

#the ant object
class Ant():
  #defining basic ant characteristics
  def __init__(self, nest):
    self.life = random.randint(1, 100)
    self.xpos = nest.xpos
    self.ypos = nest.ypos
    self.reproductionChance = random.randint(1, 50)
    
  #spawning the ant on the screen
  def exist(self):
    myDisplay.set_at((self.xpos, self.ypos), (255,255,255))
      
#the food source object
class Foodsource:
  def __init__(self, environment):
    self.life = 100
    
#the pheremone object
class Pheremone:
  def __init__(self):
    self.life = 50
    self.xpos = ant.xpos
    self.ypos = ant.ypos

#Bringing the ants into the world
def antCreation(myNest):
  for ant in range(population):
    colony.append(Ant(myNest))
  for ant in colony:
    ant.exist()

#moving the ants!
def moveAnts(acolony):
  for ant in acolony:
    #set old position to a black pixel
    myDisplay.set_at((ant.xpos, ant.ypos), (0,0,0))
    #change position
    newxpos = ant.xpos + (random.randint(-1, 1))
    newypos = ant.ypos + (random.randint(-1, 1))
    ant.xpos = newxpos
    ant.ypos = newypos
    #draw ant in new position
    myDisplay.set_at((ant.xpos, ant.ypos), (255,255,255))

#age the ants
def ageAnts(myColony):
  for ant in myColony:
    #reduce the ant's lifespan
    ant.life -= 1
    #kill the ant
    if ant.life < 0:
      myDisplay.set_at((ant.xpos, ant.ypos), (0,0,0))
      #remove it from the Colony list
      colony.remove(ant)

#Ant reproduction
def moreAnts(myColony, myNest):
  for ant in myColony:
    if ant.reproductionChance == reproductionNumber:
      newAnt = Ant(myNest)
      colony.append(newAnt)
      newAnt.exist()

#Leave a signal
def leaveFoodSignal(ant):

#Strengthening the pheremone pathway
def trackPheremone(colony):
    for ant in colony:
        if myDisplay.get_at((ant.xpos + 1, ant.ypos + 1)) == (0,255,0):
            print("Food_pheremone!")
      
      
#run the code  
nest = Nest()
antCreation(nest)
pg.display.update()

#ever-lasting loop
while True:
    time.sleep(delay)
    for event in pg.event.get():
        if event.type == QUIT:
            pg.quit()
        pg.display.update()
    moveAnts(colony)
    trackPheremone(colony)
    ageAnts(colony)
    moreAnts(colony, nest)
    pg.display.update()
    populationData.append(len(colony))
    if len(colony) == 0:
      pg.quit()
      plt.plot(populationData)
      plt.savefig("graphOfPopulation.png")
      break
    
            
