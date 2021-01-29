from sympy import *

p = Symbol('p', integer=True, positive=True)
d = p+1

coes = []  # f_p coefficients in decreasing power
coes.append(1/d)  # highest term: (1/d)*n^d

for i in range(1,20):
    mat = [binomial(d-j,p-i).expand(func=True) for j in range(i)]
    c = -sum([mat[j]*coes[j] for j in range(i)])/(d-i)
    coes.append(factor(simplify(c)))
    print(d-i, ':', coes[-1])

"""
p : -1/2
p - 1 : p/12
p - 2 : 0
p - 3 : -p*(p - 2)*(p - 1)/720
p - 4 : 0
p - 5 : p*(p - 4)*(p - 3)*(p - 2)*(p - 1)/30240
p - 6 : 0
p - 7 : -p*(p - 6)*(p - 5)*(p - 4)*(p - 3)*(p - 2)*(p - 1)/1209600
p - 8 : 0
p - 9 : p*(p - 8)*(p - 7)*(p - 6)*(p - 5)*(p - 4)*(p - 3)*(p - 2)*(p - 1)/47900160
p - 10 : 0
p - 11 : -691*p*(p - 10)*(p - 9)*(p - 8)*(p - 7)*(p - 6)*(p - 5)*(p - 4)*(p - 3)*(p - 2)*(p - 1)/1307674368000
p - 12 : 0
p - 13 : p*(p - 12)*(p - 11)*(p - 10)*(p - 9)*(p - 8)*(p - 7)*(p - 6)*(p - 5)*(p - 4)*(p - 3)*(p - 2)*(p - 1)/74724249600
p - 14 : 0
p - 15 : -3617*p*(p - 14)*(p - 13)*(p - 12)*(p - 11)*(p - 10)*(p - 9)*(p - 8)*(p - 7)*(p - 6)*(p - 5)*(p - 4)*(p - 3)*(p - 2)*(p - 1)/10670622842880000
p - 16 : 0
p - 17 : 43867*p*(p - 16)*(p - 15)*(p - 14)*(p - 13)*(p - 12)*(p - 11)*(p - 10)*(p - 9)*(p - 8)*(p - 7)*(p - 6)*(p - 5)*(p - 4)*(p - 3)*(p - 2)*(p - 1)/5109094217170944000
p - 18 : 0
"""
