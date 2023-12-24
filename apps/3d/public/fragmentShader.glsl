/* by DarthNOdlehS */
uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

int n_iters = 50;
float x_center = 0.0;   // square window: wide, x_center, y_center
float y_center = 0.0;
float wide = 2.0;       // initial wide
float max_expo = 7.0;
float period  = 50.0;
float x_color = 50.0;
float epsilon = 0.001;

float fractal_z3miz(vec2 c){
    vec2 zn2 = vec2(0.0, 0.0);
    vec2 z = zn2;
    int counter;
     //working f(z) = z^3 - 1/z 
    for (counter=0; counter<n_iters; counter++){
        float r2 = zn2.x + zn2.y + epsilon;
        z.x = z.x * zn2.x - 3.0 * zn2.y * z.x - z.x / r2 + c.x;
        z.y = 3.0 * zn2.x * z.y - zn2.y * z.y + z.y / r2 + c.y;
        zn2.x = z.x * z.x;
        zn2.y = z.y * z.y;
        
        if(zn2.x + zn2.y > 4.0)
            break;
    }
    if (counter >= n_iters)
        return -1.0;
    else{
        return length(z) * x_color;
    }     
}

void main( ){
    vec2 fragCoord = vUv * iResolution;
    vec2 r =  vec2(fragCoord.xy/iResolution.y); 
    float argu = 6.2831853 *iTime/period;
    float wide = wide*pow(2.0, max_expo *(cos(argu) - 1.0));
    float xcenter = x_center +  0.001*cos(1.0 + argu);  
    vec2 uv= vec2(xcenter,y_center) + wide *(vec2(0.5, 0.5) - r);  
    float gg = fractal_z3miz(vec2(uv.x,uv.y)); 
    if (gg < 0.0)
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    else {
        float hue_col = 6.0 * fract(gg); 
        gl_FragColor = vec4(-1.0 + abs(3.0 - hue_col),
                             2.0 - abs(2.0 - hue_col),
                             2.0 - abs(4.0 - hue_col),
                             1.0);
    }
}