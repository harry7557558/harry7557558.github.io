def find_fp(p):
    from math import gcd
    d = p+1

    # sample points
    x = [xj for xj in range(0,d+1)]
    y = [sum([k**p for k in range(1,xj+1)]) for xj in x]

    # matrix and vector
    A = [[xj**i for i in range(0,d+1)] for xj in x]
    c = [yj for yj in y]

    # solve the linear system using elimination
    for i in range(0,d+1):
        for j in range(0,d+1):
            if j!=i:
                Aii,Aji = A[i][i],A[j][i]
                Aii,Aji = Aii//gcd(Aii,Aji),Aji//gcd(Aii,Aji)  # prevent large numbers
                for k in range(0,d+1):
                    A[j][k] = A[j][k]*Aii-A[i][k]*Aji
                c[j] = c[j]*Aii-c[i]*Aji

    # return the coefficients of the polynomial
    # as a list of fraction strings in increasing power
    c = [[c[i]//gcd(A[i][i],c[i]), A[i][i]//gcd(A[i][i],c[i])] for i in range(d+1)]
    return [str(f[0])+'/'+str(f[1]) for f in c]

print(find_fp(6))
