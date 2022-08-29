## Sum of powers of consecutive integers

You may have heard this equation from math class:

$\displaystyle{\sum_{k=1}^{n}k^{1}=1+2+3+\cdots+n=\frac{1}{2}n^{2}+\frac{1}{2}n=\frac{1}{2}n\left(n+1\right)}$

Some may have seen these:

$\displaystyle{\sum_{k=1}^{n}k^{2}=\frac{1}{6}\left(2n^{3}+3n^{2}+n\right)=\frac{1}{6}n\left(n+1\right)\left(2n+1\right)}$

$\displaystyle{\sum_{k=1}^{n}k^{3}=\frac{1}{4}\left(n^{4}+2n^{3}+n^{2}\right)=\frac{1}{4}n^{2}\left(n+1\right)^{2}}$

And trivially:

$\displaystyle{\sum_{k=1}^{n}k^{0}=\underbrace{1+1+\cdots+1}_{n\ 1s}=n}$

These equations are all in the form of the sum of the power of consecutive integers from $1$ to $n$ equals a polynomial with degree $p+1$, where the power $p$ is a non-negative integer.

Proving these identities are not hard using mathematical induction. For a polynomial $f(n)$, if you can show $f(0)=0$ or $f(1)=1$, as well as $f(n)=f(n-1)+n^p$, then you can proof $\displaystyle{f(n)=\sum_{k=1}^{n}k^{p}}$.

But why the degree of the polynomials are always $p+1$? One may intuitively think that we are summing a $p$th-degree polynomial $n$ times that the terms are from $1^p$ to $n^p$, $n$ times $n^p$ should give $n^{p+1}$. Or replacing the sum by an integral, $\displaystyle{\int_0^n{k^p\mathrm{d}k}=\frac{1}{p+1}n^{p+1}}$, so the highest term of $\displaystyle{\sum_{k=0}^n{k^p}}$ is $\dfrac{1}{p+1}n^{p+1}$. However, these are not formal proofs.

I think of a way to show that the degree of $f_p(n)$ is at least $p+1$. Let the coefficients of $f_p$ be $c$. Since $\displaystyle{f(n)=\sum_{i=0}^{\mathrm{deg}f}c_{i}n^{i}=n^{p}+\sum_{i=0}^{\mathrm{deg}f}c_{i}(n-1)^{i}}$, the highest term of $\displaystyle{\sum_{i=0}^{\mathrm{deg}f}c_{i}n^{i}}$ is $c_{\mathrm{deg}f}n^{\mathrm{deg}f}$ and the highest term of $\displaystyle{\sum_{i=0}^{\mathrm{deg}f}c_{i}(n-1)^{i}}$ is also $c_{\mathrm{deg}f}n^{\mathrm{deg}f}$ after expansion. Adding a $n^p$ does not change the term with the highest degree, so $\mathrm{deg}f$ must be at least $p+1$. In the following experiment, you can see the degree of $f_p$ is exactly $p+1$.
