import numpy as np
from json import JSONEncoder
import logging

LOGGER_FORMAT = '%(asctime)s - %(message)s'
logging.basicConfig(format = LOGGER_FORMAT)
LOGGER = logging.getLogger('backend_service')
LOGGER.setLevel(logging.DEBUG)

class MyEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__ 

class maze:
    def __init__(self, id, graph, width, height, start, end, size):
        self.id = id
        self.graph = graph
        self.width = width
        self.height = height
        self.start = start
        self.end = end
        self.size = size

class maze_creater:
    def __init__(self, width, height):
        self.nx = height
        self.ny = width
        self.kx = (self.nx-1)//2
        self.ky = (self.ny-1)//2
        # self.nx = self.kx*2+1
        # self.ny = self.ky*2+1
        self.maze = np.zeros((self.nx,self.ny))
        self.reset()
        
    def reset(self):
        self.cur_x = 1
        self.cur_y = 1
        self.end_x = self.nx-2
        self.end_y = self.ny-2
        for i in range(self.nx):
            for j in range(self.ny):
                self.maze[i,j] = 0
                
    def reset_random_start_end(self):
        self.cur_x = np.random.choice(self.kx)*2+1
        self.cur_y = np.random.choice(self.ky)*2+1
        self.end_x = np.random.choice(self.kx)*2+1
        self.end_y = np.random.choice(self.ky)*2+1
        count = 0
        while self.cur_x == self.end_x and self.end_x == self.end_y and count < 10:
            self.cur_x = np.random.choice(self.kx)*2+1
            self.cur_y = np.random.choice(self.ky)*2+1
            self.end_x = np.random.choice(self.kx)*2+1
            self.end_y = np.random.choice(self.ky)*2+1
            count += 1
        if count == 10:
            print('Unable to generate. Please recreate maze.')
            return
        for i in range(self.nx):
            for j in range(self.ny):
                self.maze[i,j] = 0
        
    def random_create_prim(self):
        move = [[-1,0],[1,0],[0,1],[0,-1]]
        walls = set()
        move_dict = {}
        self.maze[self.cur_x,self.cur_y] = 1
        for i in range(4):
            x, y = self.cur_x+move[i][0], self.cur_y+move[i][1]
            if 0 < x < self.nx-1 and 0 < y < self.ny-1:
                val = str(x)+'#'+str(y)
                walls.add(val) 
                move_dict[val] = i
        while walls != set():
            val = np.random.choice(list(walls))
            i0 = move_dict[val]
            walls.remove(val)
            del move_dict[val]
            val = val.split('#')
            x, y = int(val[0]), int(val[1])
            x1, y1 = x + move[i0][0], y + move[i0][1]
            if self.maze[x1, y1] == 0:
                self.maze[x, y] = 1
                self.maze[x1, y1] = 1
                for i in range(4):
                    x2, y2 = x1+move[i][0], y1+move[i][1]
                    if 0 < x2 < self.nx-1 and 0 < y2 < self.ny-1 and self.maze[x2,y2] == 0:
                        val = str(x2)+'#'+str(y2)
                        walls.add(val) 
                        move_dict[val] = i
    
    def get_maze(self):
        maze_info = np.asarray(self.maze).reshape(-1).astype(int).astype(str)
        maze_string = ''
        for i in range(len(maze_info)):
            maze_string += maze_info[i]
        maze_start = self.cur_x*self.ny + self.cur_y
        maze_end = self.end_x*self.ny + self.end_y
        if(self.nx*self.ny < 225):
            size = 'small'
        elif(self.nx*self.ny < 2500):
            size = 'medium'
        else:
            size = 'large'
        return MyEncoder().encode(maze(0, maze_string, self.ny, self.nx, maze_start, maze_end, size))
        
def maze_creation(width, height):
    LOGGER.debug("maze createion is called with width %d and height %d", width, height)
    my_creater = maze_creater(width, height)
    my_creater.random_create_prim()
    return my_creater.get_maze()