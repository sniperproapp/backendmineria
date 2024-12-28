# sys: Librería con funciones y variables para manipular el entorno de ejecución.
import sys
from binance.pay.merchant import Merchant as Client
# sys.stdin: Utilizado para ingreso interactivo de datos
# sys.stdin.readline(): Lee el contenido ingresado hasta que encuentra el carácter de salto de línea, o sea, hasta que se presiona saltar.
key = sys.stdin.readline()
# print(): Imprime datos en pantalla. Cuando Python es ejecutado como un subproceso, envía los datos al programa que invocó a Python.
#print("hola", nombre)
info=key.split("=")
client = Client(key=info[0], secret=info[1])
response = client.get_order(merchantTradeNo=info[2])
print(response)
# sys.stdout.flush(): Fuerza la salida de datos del buffer
sys.stdout.flush()







 
