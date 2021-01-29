def find_fp_pascal(p):
    d = p+1
    
    # construct a Pascal matrix using the recursive relationship
    A = [[0]*d for i in range(d)]
    A[0][0]=1
    for i in range(1,d):
        A[0][i] = (-1 if i&1 else 1)
        for j in range(1,i):
            A[j][i] = (abs(A[j-1][i-1])+abs(A[j][i-1])) * (-1 if (i+j)&1 else 1)
        A[i][i]=i+1
    
    # initial vector
    c = [(1 if i==d-1 else 0) for i in range(d)]
    
    # solve the linear system in O(d²)
    for i in range(d-1,-1,-1):
        for j in range(i-1,-1,-1):
            c[j] -= c[i]*A[j][i]/A[i][i]
            A[j][i]=0
        c[i] = c[i]/A[i][i]
        A[i][i]=1
    
    # return the coefficients of f_p in decimals
    c.insert(0,0)
    return c

print(find_fp_pascal(6))
