//DSolve[D[u[x,t],t]==D[u[x,t],x]+u[x,t]+x+t,u[x,t],{x,t}]
var default_N = 10;
var default_A = 0;
var default_B = 1;
var default_f_a = 0;
var default_f_b = 0;
var default_f_a_funk = 0;
var default_f_b_funk = 0;

function OneDimension() {
    this.el = $('#main_form');
    var common = this.el.find('.common_settings');
    this.isEnter = isEnter;
    this.n = common.find('#number').val();
    this.n = this.isEnter(this.n) ? +this.n : default_N;
    this.a = common.find('#left_border').val();
    this.a = this.isEnter(this.a) ? +this.a : default_A;
    this.b = common.find('#right_border').val();
    this.b = this.isEnter(this.b) ? +this.b : default_B;
    this.f_a = common.find('#x0_factor').val();
    this.f_b = common.find('#x1_factor').val();
    this.f_a = this.isEnter(this.f_a) ? +this.f_a : default_f_a;
    this.f_b = this.isEnter(this.f_b) ? +this.f_b : default_f_b;
    this.h = (this.b - this.a) / (this.n - 1);
    this.A_matrix = new Array();
    this.b_vector = new Array();
    this.answer = new Array();
    this.fi_i = one_direct_fi_i;
    this.diff_fi_i = one_direct_diff_fi_i;
    this.init_system = initialize;
    this.get_matrix_element = get_matrix_element;
    this.int_cells = one_direct_int_cells;
    this.get_answ = get_answ;
    this.graph = draw_plot;
    this.define_border_condition = ch;
}

function TwoDimension() {
    this.el = $('#main_form');
    var common = this.el.find('.common_settings');
    this.isEnter = isEnter;
    this.n = common.find('#number').val();
    this.n = this.isEnter(this.n) ? +this.n : default_N;
    this.a = {
        x:common.find('#left_border_1').val(),
        y:common.find('#left_border_2').val(),
    };
    this.a.x = this.isEnter(this.a.x) ? +this.a.x : default_A;
    this.a.y = this.isEnter(this.a.y) ? +this.a.y : default_A;
    this.b = {
        x:common.find('#right_border_1').val(),
        y:common.find('#right_border_2').val(),
    };
    this.b.x = this.isEnter(this.b.x) ? +this.b.x : default_B;
    this.b.y = this.isEnter(this.b.y) ? +this.b.y : default_B;
    this.f_a = common.find('#x0_factor').val();
    this.f_b = common.find('#x1_factor').val();
    this.f_a = this.isEnter(this.f_a) ? this.f_a : default_f_a_funk;
    this.f_b = this.isEnter(this.f_b) ? this.f_b : default_f_b_funk;
    this.h = (this.b.x - this.a.x) / (this.n - 1);
    this.tau = (this.b.y - this.a.y) / (this.n - 1);
    this.A_matrix = new Array();
    this.b_vector = new Array();
    this.answer = new Array();
    this.fi_i = two_direct_fi_i;
    this.diff_fi_i_x = two_direct_diff_fi_i_x;
    this.diff_fi_i_y = two_direct_diff_fi_i_y;
    this.init_system = two_dimension_initialize;
    this.get_matrix_element = two_dimension_get_matrix_element;
    this.int_cells = two_direct_int_cells;
    this.get_answ = two_dimension_get_answ;
    this.graph = draw_plot;
    this.define_border_condition = ch2;
}

function initialize() {
    for (var i = 1; i < this.n-1; ++i) {
        var funk = {value: 0};
        for (var j = 0; j < this.n; ++j) {
            if (j == 0)
                this.A_matrix[i-1] = new Array;
            if(j != 0 && j != this.n-1)
                this.A_matrix[i-1][j-1] = 0;
            this.get_matrix_element(i, j, funk);
        }
        this.b_vector[i-1] = funk.value;
    }
}

function two_dimension_initialize(){
    for (var i = 1; i < this.n-1; ++i)
        for (var k = 1; k < this.n-1; ++k){
            var funk = {value: 0};
            for (var j = 0; j < this.n; ++j)
                for (var l = 0; l < this.n; ++l){
                    if (j == 0)
                        this.A_matrix[(i-1)*(this.n-2)+k-1] = new Array;
                    if(j != 0 && j != this.n-1 && l != 0 && l != this.n-1)
                        this.A_matrix[(i-1)*(this.n-2)+k-1][(j-1)*(this.n-2)+l-1] = 0;
                    this.get_matrix_element(i, k, j, l, funk);
                }
            this.b_vector[(i-1)*(this.n-2)+k-1] = funk.value;
        }    
}

function get_matrix_element(i, j, funk) {
    if (Math.abs(i - j) < 1.01) {
        if(i != 0 && i != this.n-1 && j != 0 && j != this.n-1)
            this.A_matrix[i-1][j-1] = this.int_cells(i, j, function (x) {
                return -this.diff_fi_i(j, x) * this.diff_fi_i(i, x);
            });
        if(i != 0 && i != this.n-1)
            funk.value += this.int_cells(i, j, function (x) {
                return this.fi_i(j, x) * this.fi_i(i, x);
            });
    }
    else
        return 0;
}

function two_dimension_get_matrix_element(i1, i2, j1, j2, funk){
    if ((Math.abs(i1 - j1) < 1.01) && (Math.abs(i2 - j2) < 1.01)) {
        if(i1 != 0 && i1 != this.n-1 && j1 != 0 && j1 != this.n-1 && i2 != 0 && i2 != this.n-1 && j2 != 0 && j2 != this.n-1)
            this.A_matrix[(i1-1)*(this.n-2)+i2-1][(j1-1)*(this.n-2)+j2-1] = this.int_cells(i1, i2, j1, j2, function (x,y) {
                return this.diff_fi_i_x(i1,i2,x,y)*this.diff_fi_i_x(j1,j2,x,y)-this.diff_fi_i_y(i1,i2,x,y)*this.diff_fi_i_y(j1,j2,x,y)+this.diff_fi_i_x(i1,i2,x,y)*this.diff_fi_i_x(j1,j2,x,y)+this.fi_i(i1,i2,x,y)*this.fi_i(j1,j2,x,y);
            });
        if(i1 != 0 && i1 != this.n-1 && i2 != 0 && i2 != this.n-1)
            funk.value += this.int_cells(i1, i2, j1, j2, function (x,y) {
                return this.fi_i(j1, j2, x, y) * this.fi_i(i1, i2, x, y);
            });
    }
    else
        return 0;
}

function one_direct_fi_i(i, x) {
    var xi = this.a + i * this.h;
    if (x > xi && x < xi + this.h)
        return (xi + this.h - x) / (this.h);
    else
    if (x <= xi && x > xi - this.h)
        return (x - xi + this.h) / (this.h);
    else
        return 0;
}

function two_direct_fi_i(i, j, x, y) {
    var xi = this.a.x + i * this.h;
    var yi = this.a.y + j * this.tau;
    if ((x > xi - this.h && x <= xi) && (y > yi - this.tau && y <= yi))
        return (x - xi + this.h) / (this.h) * (y - yi + this.tau) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi - this.tau && y <= yi))
        return (xi + this.h - x) / (this.h) * (y - yi + this.tau) / (this.tau);
    else if ((x > xi - this.h && x <= xi) && (y > yi && y <= yi + this.tau))
        return (x - xi + this.h) / (this.h) * (yi + this.tau - y) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi && y <= yi + this.tau))
        return (xi + this.h - x) / (this.h) * (yi + this.tau - y) / (this.tau);
    else
        return 0;
}

function one_direct_diff_fi_i(i, x) {
    var xi = this.a + i * this.h;
    if (x > xi && x < xi + this.h)
        return -1 / (this.h);
    else
    if (x <= xi && x > xi - this.h)
        return 1 / (this.h);
    else
        return 0;
}

function two_direct_diff_fi_i_x(i, j, x, y){
    var xi = this.a.x + i * this.h;
    var yi = this.a.y + j * this.tau;
    if ((x > xi - this.h && x <= xi) && (y > yi - this.tau && y <= yi))
        return 1 / (this.h) * (y - yi + this.tau) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi - this.tau && y <= yi))
        return -1 / (this.h) * (y - yi + this.tau) / (this.tau);
    else if ((x > xi - this.h && x <= xi) && (y > yi && y <= yi + this.tau))
        return 1 / (this.h) * (yi + this.tau - y) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi && y <= yi + this.tau))
        return -1 / (this.h) * (yi + this.tau - y) / (this.tau);
    else
        return 0;    
}

function two_direct_diff_fi_i_y(i, j, x, y){
    var xi = this.a.x + i * this.h;
    var yi = this.a.y + j * this.tau;
    if ((x > xi - this.h && x <= xi) && (y > yi - this.tau && y <= yi))
        return (x - xi + this.h) / (this.h) * 1 / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi - this.tau && y <= yi))
        return (xi + this.h - x) / (this.h) * 1 / (this.tau);
    else if ((x > xi - this.h && x <= xi) && (y > yi && y <= yi + this.tau))
        return (x - xi + this.h) / (this.h) * (-1) / (this.tau);
    else if ((x > xi && x <= xi + this.h) && (y > yi && y <= yi + this.tau))
        return (xi + this.h - x) / (this.h) * (-1) / (this.tau);
    else
        return 0;   
}

function one_direct_int_cells(ii, jj, f) {
    var xa = this.a + ii * this.h;
    var xb = this.a + jj * this.h;
    var xe, xq;
    xq = (xa < xb) ? xa : xb;
    if (ii !== jj)
        xe = ii > jj ? (xa) : (xb);
    else {
        xe = xb + this.h;
        xq = xb - this.h;
    }
    var num_stong = 100;
    var hxx = Math.abs(xq - xe) / (num_stong - 1);
    var s = 0;
    this.f = f;
    for (var i = 0; i < num_stong; ++i) {
        var xs = Math.abs((xq + i * hxx) - (xq + (i + 1) * hxx));
        s = s + xs * this.f(xq + (i + 1 / 2) * hxx);
    }
    return s;
}

function two_direct_int_cells(x1, y1, x2, y2, f) {
    var xa = this.a.x + x1 * this.h;
    var xb = this.a.x + x2 * this.h;
    var ya = this.a.y + y1 * this.tau;
    var yb = this.a.y + y2 * this.tau;
    var xe, xq;
    xq = (xa < xb) ? xa : xb;
    if (x1 !== x2)
        xe = x1 > x2 ? (xa) : (xb);
    else {
        xe = xb + this.h;
        xq = xb - this.h;
    }
    var ye, yq;
    yq = (ya < yb) ? ya : yb;
    if (y1 !== y2)
        ye = y1 > y2 ? (ya) : (yb);
    else {
        ye = yb + this.tau;
        yq = yb - this.tau;
    }    
    var num_stong = 100;
    var hxx = Math.abs(xq - xe) / (num_stong - 1);
    var hyy = Math.abs(yq - ye) / (num_stong - 1);
    var s = 0;
    this.f = f;
    for (var i = 0; i < num_stong; ++i) {
        for (var j = 0; j < num_stong; ++j) {
            var xs = Math.abs((xq + i * hxx) - (xq + (i + 1) * hxx));
            var ys = Math.abs((yq + j * hyy) - (yq + (j + 1) * hyy));
            s = s + xs * ys * this.f(xq + (i + 1 / 2) * hxx, yq + (j + 1 / 2) * hyy);
        }
    }
    return s;
}

function get_answ(x) {
    var s = 0;
    for (var i = 0; i < this.answer.length; ++i) {
        s += this.answer[i] * this.fi_i(i+1, x);
    }
    return s + this.define_border_condition(x);
}

function two_dimension_get_answ(x, y) {
    var s = 0;
    for (var i = 0; i < this.answer.length; ++i) {
        s += this.answer[i] * this.fi_i(Math.floor(i/(this.n-2)), i%(this.n-2), x, y);
    }
    return s + this.define_border_condition(x);
}

function draw_plot() {
    var f1 = function (x) {
        return Math.pow(x, 2) / 2 + 1.5 * x + 1;
    };
    var board = JXG.JSXGraph.initBoard('jxgbox', {keepaspectratio: true, boundingbox: [this.a-1, Math.max(this.f_a,this.f_a) + 5, this.b+1, Math.min(this.f_a,this.f_a) - 5], axis: true});
    var x = this.a;
    var turtle = board.create('turtle', [x, this.get_answ(x)], {strokeWidth: 3, strokeColor: 'green'});
    var turtle1 = board.create('turtle', [x, f1(x)]);
    var delta = 0.01;
    for (; x <= this.b + 1.0 * delta; x = x + delta) {
        turtle.moveTo([x, this.get_answ(x)]);
        turtle1.moveTo([x, f1(x)]);
    }
}

function ch(x){
    return (x - this.a)/(this.b - this.a)*(this.f_b - this.f_a) + this.f_a;
}

function ch2(x){
    return 0;
}

function isEnter(el){
    if(isFinite(el) && el!=="")
        return true;
    else
        return false;
}

function try_funk_x(str, x) {
    return eval(str);
}

function try_funk_t(str, t) {
    return eval(str);
}

function Gauss(A, b) {
    this.A = A;
    this.b = b;
    this.solve = function () {
        var mas = new Array();
        var x = new Array(); //Корни системы
        var otv = new Array(); //Отвечает за порядок корней
        var i, j, k;
        var n = b.length;
        //Сначала все корни по порядку
        for (i = 0; i < n; i++)
            otv[i] = i;
        //Сливаем главную матрицу и правые части в один массив
        for (i = 0; i < n; i++) {
            mas[i] = new Array();
            for (j = 0; j < n; j++) {
                mas[i][j] = this.A[i][j];
            }
            mas[i][n] = this.b[i];
        }
        //Прямой ход метода Гаусса
        for (k = 0; k < n; k++)
        { //На какой позиции должен стоять главный элемент
            this.glavelem(k, mas, n, otv); //Установка главного элемента
            if (Math.abs(mas[k] [k]) < 0.0001)
            {
                alert("Система не имеет единственного решения");
                return;
            }
            for (j = n; j >= k; j--)
                mas[k] [j] /= mas[k] [k];
            for (i = k + 1; i < n; i++)
                for (j = n; j >= k; j--)
                    mas[i] [j] -= mas[k] [j] * mas[i] [k];
        }
        //Обратный ход
        for (i = 0; i < n; i++)
            x[i] = mas[i] [n];
        for (i = n - 2; i >= 0; i--)
            for (j = i + 1; j < n; j++)
                x[i] -= x[j] * mas[i] [j];
        //Вывод результата
        console.log("Ответ:\n");
        for (i = 0; i < n; i++)
            for (j = 0; j < n; j++)
                if (i == otv[j])
                { //Расставляем корни по порядку
                    var temp = x[i];
                    x[i] = x[j];
                    x[j] = temp;
                    temp = otv[i];
                    otv[i] = otv[j];
                    otv[j] = temp;
                    console.log(x[j]);
                    break;
                }
        return x;
    };
    this.glavelem = function (k, mas, n, otv) {
        var i, j, i_max = k, j_max = k;
        var temp;
        //Ищем максимальный по модулю элемент
        for (i = k; i < n; i++)
            for (j = k; j < n; j++)
                if (Math.abs(mas[i_max] [j_max]) < Math.abs(mas[i] [j]))
                {
                    i_max = i;
                    j_max = j;
                }
        //Переставляем строки
        for (j = k; j < n + 1; j++)
        {
            temp = mas[k] [j];
            mas[k] [j] = mas[i_max] [j];
            mas[i_max] [j] = temp;
        }
        //Переставляем столбцы
        for (i = 0; i < n; i++)
        {
            temp = mas[i] [k];
            mas[i] [k] = mas[i] [j_max];
            mas[i] [j_max] = temp;
        }
        //Учитываем изменение порядка корней
        i = otv[k];
        otv[k] = otv[j_max];
        otv[j_max] = i;
    };
}