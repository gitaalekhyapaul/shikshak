import pickle

class dbWithPick:
    def __init__(self,path):
        db = {}
        self.path = path + "pyDB.p"
        pickle.dump(db, open(self.path, "wb"))
    
    def add_overwrite(self,uid,points):
        db = self.load()
        db[uid] = points
        self.save(db)

    def getpoints(self,uid):
        db = self.load()
        points = db[uid]
        return points

    def __len__(self):
        db = self.load()
        return len(db)

    def load(self):
        return pickle.load(open(self.path, "rb"))

    def save(self,db):
        pickle.dump(db, open(self.path, "wb"))


if __name__ == "__main__":
    database = dbWithPick("./")
    database.add_overwrite("FUCK",[[1,5],[8,9]])
    database.add_overwrite("FcuK",[[1,9],[8,5],[56,34],[98,129]])
    Z = database.getpoints("FUCK")
    print(Z)
    print(len(database))