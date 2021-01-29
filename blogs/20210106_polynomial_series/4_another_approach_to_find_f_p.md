## Another approach to find $$f_p$$

In the purpose of proving these identities, I discovered another approach to find the coefficients of $$f_p$$.

From the induction formula:

$$\displaystyle{f_p(n)=\sum_{k=0}^{m}c_k n^k=n^p+\sum_{k=0}^{m}c_k(n-1)^k}$$

where $$m$$ is a number that is large enough and is at least the degree of $$f_p$$, which I guessed its value is $$p+1$$ before.

Let $$\mathbf{n}=\begin{bmatrix}n^0&n^1&\cdots&n^m\end{bmatrix}^T$$ and $$\mathbf{c}=\begin{bmatrix}c_0&c_1&\cdots&c_m\end{bmatrix}^T$$, the left part of the equation becomes:

$$\displaystyle\sum_{k=0}^{m}c_k n^k=\begin{bmatrix}n^0&n^1&\cdots&n^m\end{bmatrix}\begin{bmatrix}c_0\\c_1\\\vdots\\c_m\end{bmatrix}=\mathbf{n}^T\cdot\mathbf{c}$$

In the right part of the equation:

$$\displaystyle{\sum_{k=0}^{m}c_k(n-1)^k=\begin{bmatrix}(n-1)^0&(n-1)^1&\cdots&(n-1)^m\end{bmatrix}\begin{bmatrix}c_0\\c_1\\\vdots\\c_m\end{bmatrix}}=\mathbf{n'}^T\cdot\mathbf{c}$$

Applying the binomial theorem:

$$\displaystyle{(n-1)^k=\sum_{i=0}^{m}\binom{k}{i}n^{i}(-1)^{k-i}}=\begin{bmatrix}n^0&n^1&\cdots&n^m\end{bmatrix}\begin{bmatrix}\binom{k}{0}(-1)^k\\\binom{k}{1}(-1)^{k-1}\\\vdots\\\binom{k}{m}(-1)^{k-m}\end{bmatrix}$$

Note that in the equation, the binomial terms are summed from $$0$$ to $$m$$. Conventionally we sum binomial terms from $$0$$ to $$k$$, but if we accept $$\binom{k}{i\gt k}=0$$, the upper bound of the summation can be extended to an arbitrary large number, and here is $$m$$.

The left vector is $$\mathbf{n}^T$$, which is independent to $$k$$. Expanding all elements, we get an expression for $$\mathbf{n'}^T$$:

$$\mathbf{n'}^T=\begin{bmatrix}n^0&n^1&\cdots&n^m\end{bmatrix}\begin{bmatrix}\binom{0}{0}(-1)^0&\binom{1}{0}(-1)^1&\cdots&\binom{m}{0}(-1)^{m}\\\binom{0}{1}(-1)^{0-1}&\binom{1}{1}(-1)^{1-1}&\cdots&\binom{m}{1}(-1)^{m-1}\\\vdots&\vdots&\ddots&\vdots\\\binom{0}{m}(-1)^{0-m}&\binom{1}{m}(-1)^{1-m}&\cdots&\binom{m}{m}(-1)^{m-m}\end{bmatrix}=\mathbf{n}^T\begin{bmatrix}1&-1&1&-1&1&\cdots\\0&1&-2&3&-4&\cdots\\0&0&1&-3&6&\cdots\\0&0&0&1&-4&\cdots\\0&0&0&0&1&\cdots\\\vdots&\vdots&\vdots&\vdots&\vdots&\ddots\end{bmatrix}$$

We can see the matrix that transforms $$\mathbf{n}^T=\begin{bmatrix}n^0&n^1&\cdots\end{bmatrix}$$ to $$\mathbf{n'}^T=\begin{bmatrix}(n-1)^0&(n-1)^1&\cdots\end{bmatrix}$$ is a Pascal triangle matrix with change of signs on some elements. Let's call it $$A$$.

Recall the induction formula for $$f_p$$, $$\mathbf{n}^T\mathbf{c}=n^p+\mathbf{n'}^T\mathbf{c}=n^p+\mathbf{n}^T\mathbf{A}\mathbf{c}$$. Let $$\mathbf{u}$$ be a 0-indexed column vector such that its $$p$$th element is $$1$$ and all other elements are $$0$$, then $$n^p=\mathbf{n}^T\mathbf{u}$$. The equation becomes $$\mathbf{n}^T\mathbf{c}=\mathbf{n}^T\mathbf{u}+\mathbf{n}^T\mathbf{A}\mathbf{c}$$. $$\mathbf{n}$$ is an independent variable. Get rid of $$\mathbf{n}^T$$ and rearrange, we get $$(\mathbf{I}-\mathbf{A})\mathbf{c}=\mathbf{u}$$. This is the equation we need to solve for $$\mathbf{c}$$.

The linear system is in the form:

$$\begin{bmatrix}0&1&-1&1&-1&\cdots\\0&0&2&-3&4&\cdots\\0&0&0&3&-6&\cdots\\0&0&0&0&4&\cdots\\0&0&0&0&0&\cdots\\\vdots&\vdots&\vdots&\vdots&\vdots&\ddots\end{bmatrix} \begin{bmatrix}c_0\\c_1\\c_2\\c_3\\c_4\\\vdots\end{bmatrix} = \begin{bmatrix}0\\\vdots\\0\\1\\0\\\vdots\end{bmatrix}$$

Its first column of the matrix $$\mathbf{I}-\mathbf{A}$$ is zero, so it is not invertible. But since we know that $$c_0=0$$, we can remove the leftmost column of the matrix. And the equation becomes:

$$\begin{bmatrix}1&-1&1&-1&\cdots\\0&2&-3&4&\cdots\\0&0&3&-6&\cdots\\0&0&0&4&\cdots\\\vdots&\vdots&\vdots&\vdots&\ddots\end{bmatrix} \begin{bmatrix}c_1\\c_2\\c_3\\c_4\\\vdots\end{bmatrix} = \begin{bmatrix}0\\\vdots\\0\\1\\0\\\vdots\end{bmatrix}$$

The $$1$$ in the right side corresponds the term with degree $$p+1$$, and all terms after it are zero. The matrix in the equation is upper triangular, which means we can remove rows after the $$p+1$$-th row, and the degree of the polynomial is exactly $$p+1$$. The bottom-right element of the remaining matrix is $$\dbinom{p+1}{p}=p+1$$, so $$c_{p+1}=\dfrac{1}{p+1}$$, and so's why $$f_p(n)$$ begins with $$\dfrac{1}{p+1}n^{p+1}$$.

Look at the second-last row of the remaining matrix. The last element is $$-\dbinom{p+1}{p-1}=-\dfrac{1}{2}p(p+1)$$, the second last element is $$\dbinom{p}{p-1}=p$$. In the equation, $$p\cdot c_p-\dfrac{1}{2}p(p+1)\cdot c_{p+1}=0$$, and one can solve $$c_p=\dfrac{1}{2}$$. This is why the second highest term of $$f_p(n)$$ is always $$\dfrac{1}{2}n^p$$.

An example of the linear system use to find the coefficients of $$f_4$$ is as follows:

$$\begin{bmatrix}1&-1&1&-1&1\\0&2&-3&4&-5\\0&0&3&-6&10\\0&0&0&4&-10\\0&0&0&0&5\end{bmatrix}\begin{bmatrix}c_1\\c_2\\c_3\\c_4\\c_5\end{bmatrix}=\begin{bmatrix}0\\0\\0\\0\\1\end{bmatrix}$$

and $$c_0=0$$.

Below is a Python code that solves the coefficients of $$f_p$$ using the new method.

    def find_fp_pascal(p):
        d = p + 1
        
        # construct a Pascal matrix using the recursive relationship
        A = [[0]*d for i in range(d)]
        A[0][0] = 1
        for i in range(1,d):
            A[0][i] = (-1 if i&1 else 1)
            for j in range(1,i):
                A[j][i] = (abs(A[j-1][i-1])+abs(A[j][i-1])) * (-1 if (i+j)&1 else 1)
            A[i][i] = i+1
        
        # initial vector
        c = [(1 if i+1==d else 0) for i in range(d)]
        
        # solve the linear system in O(d²)
        for i in range(d-1,-1,-1):
            for j in range(i-1,-1,-1):
                c[j] -= c[i]*A[j][i]/A[i][i]
                A[j][i]=0
            c[i] = c[i]/A[i][i]
            A[i][i] = 1
        
        # return the coefficients of f_p in decimals
        c.insert(0,0)
        return c

