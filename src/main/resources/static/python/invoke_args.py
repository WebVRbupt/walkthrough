import numpy as np
import pandas as pd

df2 = pd.DataFrame(np.array([[1, 2, 3], [4,5, 6], [7, 8, 9]]))

def invokeNoArgs():
   print("hello")
   return df2
print(df2)