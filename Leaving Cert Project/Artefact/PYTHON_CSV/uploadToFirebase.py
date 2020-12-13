#Purpose: To generate questions and send them to Firebase.

#Import packages
import pandas as pd
import random
import json

#Open Firebase and open CSVs as Pandas Dataframes.
carbon = pd.read_csv("carbon_dioxide.csv")
methane = pd.read_csv("methane.csv")
nitrous_oxide = pd.read_csv("nitrous_oxide.csv")

#Remove characters illegal in JSON.
for row in carbon.itertuples(index = False):
    row[0].replace(".", "")

for row in methane.itertuples(index = False):
    row[0].replace(".", "")
    
for row in nitrous_oxide.itertuples(index = False):
    row[0].replace(".", "")




#Miscellaneous variables
qNum = 40
data = {}


#Generate questions related to carbon dioxide data:
def generateQuestion():
    randomYear = random.randint(1970, 2010) #Gets random year
    allYears = methane.groupby(["Year"]).get_group(randomYear) # gets all rows where the year column is randomYear
    countryChoice = allYears.sample(n = 4) # Gets a sample of 4
    yearList = {row[0] : row[2] for row in countryChoice.itertuples(index = False)} # Creates a dictionary with country as the key and its carbon as the value
    returnList = {randomYear: yearList}
    return returnList # Returns dictionary with Year: Countries

#This generates qNum amount of questions
for i in range(qNum):
    i = i + 1
    data[i] = generateQuestion()

#Writes the dictionaries as a JSON file.
with open('methaneQs.json', 'a+') as outfile:
    json.dump(data, outfile)
outfile.close()
        

 


        

        

    

    

