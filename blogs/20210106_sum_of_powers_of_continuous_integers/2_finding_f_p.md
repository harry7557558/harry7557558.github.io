## Finding $$f_p$$

After seeing the equations with power $$p=0,1,2,3$$, one may have a question: are their equations for higher $$p$$? What do these equations look like?

I thought about this problem two years ago. My approach to generate arbitrary $$f_p$$ was as follows:

- Assume the degree of $$f_p$$ is $$d=p+1$$
- Sample $$f_p(0),f_p(1),\cdots f_p(d)$$
- Find the coefficients of a $$d$$-th degree polynomial that goes through $$(0,f_p(0)),(1,f_p(1)),\cdots(d,f_p(d))$$

When I get a list of points $$(x_0,y_0),(x_1,y_1),\cdots(x_d,y_d)$$, to find a polynomial that goes through all of the points, I let the polynomial be $$\displaystyle{P(x)=\sum_{i=0}^{d}c_{i}x^{i}}$$. One can see:

$$\displaystyle{y_j=\sum_{i=0}^{d}c_{i}x_j^i}=\begin{bmatrix}x_j^0&x_j^1&\cdots&x_j^d\end{bmatrix}\begin{bmatrix}c_0\\c_1\\\vdots\\c_d\end{bmatrix}$$&emsp;&emsp;  for $$0\le j\le d$$

Put all points together, I get the following systems of linear equations:

$$\begin{bmatrix}y_0\\[3pt]y_1\\[3pt]\vdots\\[3pt]y_d\end{bmatrix}=\begin{bmatrix}x_0^0&x_0^1&\cdots&x_0^d\\[3pt]x_1^0&x_1^1&\cdots&x_1^d\\[3pt]\vdots&\vdots&\ddots&\vdots\\[3pt]x_d^0&x_d^1&\cdots&x_d^d\end{bmatrix}\begin{bmatrix}c_0\\[3pt]c_1\\[3pt]\vdots\\[3pt]c_d\end{bmatrix}$$

Note that the matrix is a Vendermonde matrix. Its determinant is non-zero since all $$x$$ values are distinct, so the linear system always have an unique solution. I wrote a Python script that solves the linear system using elimination and determines the coefficients of the polynomial, and thus finds $$f_p$$.

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
