import numpy as np
from math import sqrt

# relative position of the sample point set
e = np.array([[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]])  # tetrahedron
e = np.array([[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]])*sqrt(3.)  # central difference
e = np.array([[1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],[-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1]])  # cube

N = len(e)

# 0th derivative: should be 0
dF0 = sum(e)/N
print(dF0)
print(np.allclose(dF0,np.zeros(3)), end='\n\n')

# first derivative: should be I
dF1 = sum([np.tensordot(e,e,axes=0) for e in e])/N
print(dF1)
print(np.allclose(dF1,np.identity(3)), end='\n\n')

# second derivative: 0-tensor achieves second order accuracy
dF2 = sum([np.tensordot(e,np.tensordot(e,e,axes=0),axes=0) for e in e])/(2*N)
print(dF2)
print(np.allclose(dF2,np.zeros((3,3,3))), end='\n\n')

# third derivative: ??
dF3 = sum([np.tensordot(e,np.tensordot(e,np.tensordot(e,e,axes=0),axes=0),axes=0) for e in e])/(6*N)
print(dF3)
print(np.sum(dF3))

