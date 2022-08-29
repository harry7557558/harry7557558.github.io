## Numerical derivative in one dimension

Numerical differentiation is a basic topic for many applications. When the analytical derivative/gradient of a function is not easy to obtain, they may be evaluated numerically.

Also, when a continuous function/field is defined by a set of discrete sample points, the its numerical gradient needs to be interpolated.

You may know these formulas in one dimension:

$f'(x) = \dfrac{f(x+h)-f(x)}{h}+O(h) = \dfrac{f(x+h)-f(x-h)}{2h}+O(h^2)$

$f''(x) = \dfrac{f(x+h)+f(x-h)-2f(x)}{h^2}+O(h^2)$

The accuracy can be analyzed using Taylor expansion. For example, to analyze the accuracy of $f'(x)\approx\frac{f(x+h)-f(x)}{h}$, one can apply a Taylor expansion to $f(x+h)$ and simplify equations:

$f(x+h)=f(x)+h f'(x)+\dfrac{h^2}{2} f''(x)$

$\dfrac{f(x+h)-f(x)}{h}=\dfrac{hf'(x)+\frac{h^2}{2}f''(x)}{h}=f'(x)+\dfrac{h}{2}f''(x)=f'(x)+O(h)$

So we can proof the error of this method (technically called forward differentiation) is first order. As $h$ goes smaller, the error is approximately propotional to $h$. Using a similar method, one can analyze the accuracy of other differentiation methods.

Since a too small $h$ can cause too much floating point inaccuracy, we can't make $h$ as small as possible. We need a method that involves higher order of error. using this method $f'(x)=\frac{f(x+h)-f(x-h)}{2h}+O(h^2)$ (technically called central difference), the error is propotional to the square of differentiation step. A step of $10^{-3}$ can achieve an accuracy of $10^{-6}$, which is enough for calculations using single precision floating point numbers.

Taylor expansion can also be used to obtain numerical differentiation methods. For example, suppose we already have samples $y_1=f(x+h_1)$, $y_2=f(x+h_2)$, and $y=f(x)$, and we need to approximate $f'(x)$ and achieve $O(h^2)$ error. We let $f'(x)\approx a_1 y_1 + a_2 y_2 + a y$, expand $y_1,y_2,y$ to the second order term and try to find $a_1,a_2,a$ so the expression equals to $f'(x)$. I got that $a_1$ and $a_2$ can be solved by solving $\begin{bmatrix}h_1^2&h_2^2\\h_1&h_2\end{bmatrix}\begin{bmatrix}a_1\\a_2\end{bmatrix}=\begin{bmatrix}0\\1\end{bmatrix}$ and $a=-(a_1+a_2)$. I used this method to approximate the tangent of a parametric curve defined by discrete sample points.

