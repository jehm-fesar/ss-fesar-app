import { Injectable } from '@angular/core';


import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class GenerarPDFServiceSSIn {
  static color: string;
  static cantidad: string;
     
  static async generaPDF_SIn(){
  //static generaPDF_ST(sst: SolicitudSTI, depto: Departamento, folio: number){
    const documentDefinition = { 
      pageSize: 'LETTER',
      pageMargins: [ 48, 20, 48, 10 ],
      content: [
       {
         table:{
           widths:['*',380,'*'],
           body:[
             [
               {
                 image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACCCAYAAACKAxD9AAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAALiMAAC4jAXilP3YAAAa9aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDQtMDFUMTk6Mjk6MjYtMDY6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA2LTE3VDE4OjE0OjAxLTA1OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA2LTE3VDE4OjE0OjAxLTA1OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkFkb2JlIFJHQiAoMTk5OCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MGZmZTNhOTUtMzAyNy00MzllLTgyNzgtYTAzY2NlZDA3NzJiIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDAwZDg5ODEtMzMyYy01ZTQ4LTk0MGItNjMxMDQyZTA2NDQ4IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6OWFlYjczYzAtNTAyYi00MmQzLWJiM2MtMjk4Njk2MmY1NTk2Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5YWViNzNjMC01MDJiLTQyZDMtYmIzYy0yOTg2OTYyZjU1OTYiIHN0RXZ0OndoZW49IjIwMjAtMDQtMDFUMTk6Mjk6MjYtMDY6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OTM0ZDM0MDYtODY5Mi00OGUxLWE0MDYtNDU3OTFlMzY3NmM2IiBzdEV2dDp3aGVuPSIyMDIwLTA0LTAxVDE5OjM0OjI5LTA2OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBmZmUzYTk1LTMwMjctNDM5ZS04Mjc4LWEwM2NjZWQwNzcyYiIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0xN1QxODoxNDowMS0wNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PnK5UAUAAC1sSURBVHic7Z15mBxVuf8/p6p7enoyyQyQQCAYICwBQhSCoKAgqCDIIoIiXvRBvIK47xvqT3HhJ4IrV1GJqLiiuCuIqLggi+z7GkhCEggJWSezdHfVuX98z5mqrq6aGeLMwJV+n6efqq6qrjp13u9593PaBCecB7AF8DngRGAKMEib/pOpAgwBvwA+CDxeAmYBdyAweCpPftvaNMnUAZwCnADsUwK+RAKCxcAfgBAoPRWta9OEUwTUgMOAXYFu4Esl4FB3QcPtL34qWtemSacZwCJgKvD8AOkLgAdpg+CZRKuA5W6/EjyVLWnT04faQGgT0AZCmxy1gdAmoA2ENjlqA6FNQBsIbXLUBkKbgDYQ2uSoDYQ2AW0gtMnR0wkIOwF7P9WNeKbS0wkI04ArgeeMcl0V5dLbNI70dALCamA6cB2wTcE12wG/RdKjTeNIkw2E7YDtC86FgAU6UdlclnZE+fOXACsmonHPZJpsIBwALCFf/HcBxu1XM+d2B+5EINk4Ya17BtNkA6Hmnnkr8O4n8buTUFEtTG4Z3bbAh4D3AFuljm8HnAm8DZV6gSTdR9B7Tc+51yuAc4GDC57VAfw38BngwFHa9V/A/wf2yTlXdvf5FLDXKPcZpsmuS+xJ7X/Jbb/8JO/RhQzLte77ieiF/9+/1bJ82pVETV0FPOH2dwc+6/Z/B/QBc4Gz3bE9gDdn7vUe4EUIOH/PedbhwEK3fxjwvII29QAXoD7YEwEsTful7hMCHy24TxNNtkSYlvm+uUCM3fbVwCWMPoI2l2zBflxw3NPpwCEF98q7HuD41P7+7pNHc0n68aWo9jBNx6X2dy64RwtNNhB6Mt/rqf2sXVBEg0A/8H7gp+5Ypfjyp4zOfxLXbgW8KnMs+93T7qn9LuCozPnDU/u7jbUBkwWE0G17M8fTht9Y51IsQnr43NSxLMCeDrQX0tNjodegauI7ScT6yeT3ydzM9yNS+8+j2RCfS7NtU0iTBYSPIYs/qwoaY/x9f2q/Sqv06CXxOJ5qWo7UFcDHgXlj+M2JbvsX4O1ufzua1YUnz+iH3fZYknkpx7jtImADkhg7jqXRkwGEHwKfRCI9a033jfTDlDKtpQ5XgIHMpT1oRD0daDrwCcRUgPPctj//cuYjIxLgCjQV7Qr3PQ8Iu7rtN4E/o0HxAnfMG45fB653+2NSD5MBhJeQqIBmwyaIavHAFOKBbgjicPi4ibFxiN2wJbZegSBK/8q4+6Xti2m0qp3JoqwkqqA5Im91349A+n5pwe9f47YPAJe5/e+47YnAs1LXziAxAH9FArYXosHg3cVvokgtwLPH8A4TDoQAhYsfcd+3HD5jLHH/tIEFM5ew77aLiTdN68LIGI8bHVSM5fR9/8Ls7nUCihmWD2UkSfKkwnhTkdeQZn4TSh3NBu4DvuG+nwO8uOAZHghdwJ+AG4D3pc6/MrW/E4m9dZ+7HhSb+ITb/xuwicS93pUx0EQDoddtH818J26UwNhN5+z3R75/8M+hs5+41qneHujmhDl38M3DfsAZe14HjTJxPNzUaYgpGzLPmgggZG0TT71u2yB/5ri3hT4IPAbMIV9EHwns4vZnIen5XBQL8PTa1P6ebusH1r8Qww9AwS2A37itl0BjystMFhB8biBhVq3KnjMeuWvH7vUnzKz2ffmgbZY8zlAX1gYQ1hcfOnPxjNr66fbgbZbuNbVn9YPUhz3ECur8bKg5L5r379IjJIw+JXX8ranzqymmjcjNLaLXu+39KCp5NgpgnQlc6M49nyS4ND91vaffua3PyP7RbW93211JorKFNNGRxV63bQWCNZSCeGNkza6bGh27NuJgaFj6Gjs0GJWmDEYhQ1Fpa2Na1MA6Wg3Nrce78Wh+4A+ANwFvQcZbicQlW1jwuzT9EFn23jPwamUmSazgi0ivZ2l/5CWchIw/L1VuT11zOQmgrkEuKMhOARnRewA3jtTIyZIIfrJlIl5tQGdYpxrWuzY1yvVNjY4qwXDALoitqRsDkTVhbA2ZgFwN6cE0zRz31otOIzHitiEBwYUkIeXR6APIG4DkRY5H9k4dJ84tLWHHX7jtEcg2mOW+35O65jJgvdv/ber4YgRkGIOdMNESYTu3fYRW8dTncNgTW2MjG6RBaUiMsDLWbMzY5mVagbAlE0dHIRF9EAovXwXcDGKca9q1yGqvA4szDF1qZO1vDSxzv7kM2QIrrbOhfAd4QBhJip+i990CSZAqyuD6a9YjqdGD4gee6sje2IrEpiikiQaCR/BiWnV4oyNoEBhbARoGm47fDwPBGFsKgngA24QEH2ZO07gBocA9uM59hq8xaJjG+t4P3OXPh0aMtUBswUoqLofh44txyxAE7vqsKxJb+izcmzo8bI8Y9zvXaUv8b23qPDIYi9zWJppoIPhKo0dJpIPImk2VICIwdFmhN9v/cWQNlSAKq2HDbmgGwhCtQNiCcSDfwZ5iWrNE/pqSY56lOQuVvUdgmu8RZK5PSwL/+xJgTXGmyv8mZhho4NoEENlifzePJhoIPoC0ltbARt0YS2jizqEoHOiPSqGPI9CsGkJaKaDVa/i3JYJFI7NEMwPSutukPqSOZxuZw7jQ/9RCV5D0fdld68PtA9bhz0Dd5Mcpmp4bpLjsd41xN7H57cnSRAPBG3A1WtOl/V1hg5KJO2MbrLc2qGZgG5mR25j1GrL33yzKMh5aLerM+RDospJIPYhxOyA+rHU/n2rF6JK7fp3VftmdH0BScYr7WGCtFdirqXtNIRFCq4HHbQYovl2Bb7eXEEDDFkuGyVINkLURrBkqBRHGUDXG1o2Jbap3sxIhC+gGrUCYjjoqa0T+25R6eBlZ4L0kkc0KMsjK7tjewD+QYTgLMXM7175HkGRc6o43kPdRRS7gJve4KShmsMTd/1lu/3HULyEC/jy3vwrxfS3wEIkgGCZvy8Tkg2GyVAO0GotDnWFEycSdDRvUGnEQp1o4mmrwYeY09SAG5QEhQNLJ90f6OQZYSXNiK/273dFor5MwYI67PkYjc0fXnsi17TYkFb4FLEN5hDvdvXpQhnERWtYQ1DcnokjhbQggs1GV02UIHO9FlUm3IU/iKFTt9HOUtNoaRR7vQjGEARTV9FVVBEb2RB5NhkTwvmwGCKa/HESUgrizFoXRYFS2GRvBfTGhtS0YDmgNMQcICMuzF7tnP0giZrPS/gXANRkjL0TVPgZ1agON1G408rZHzL7aHetERSH3ICbeDaxxffAEGtWdyPN4FNk0HrQDCBhVxLwdEbBuQsBb7555oGvXT5Hrudi163R33UXuHke67ROuPx6wcNNIUmEigdDtnrfMfW/W4ZZ6RxBjsFVg0BjblTprjLGRtQZj4lJo4jjT9DzVAMUZSO/pQX4QLUhf6AbNC5H4/jOKLJ7iTi1FInoj6tNu926rgF+jkbmNe++Frp0BKhK5CUmNG5BEmYNG9hIkPea6ax9HTF6JytG6UJ1jD0o2gUB1q9ufjyTeCiQV5qPJQtsgCbWXa+ffiqTCRALBh3x9eLnXn7AAxq4thw0spsMY6gabYpAx9TiIYwyVICpXS41NmTjCFJJoWpqKEk/pV78WVf9MR50UInGbpfvQCNwZ6fq1iCE3o5F2PwrkzEajvB9JgV7ElP0RiPZHdsUvXTvSM7VucPcsu/e5miSEfQICyN/cvWcg9TSE1sO8HoXa9wM+jSTMFNfeqe66XhSCnkO+ih2myQCCj2o1l0wZW6sEEQZbqUVBfTAqWaWaLVhjBhtljPhXyjF2O9BoydJYYglrUXXPw0UXOKnwmLvf84HfI0mwCvXZUjQiv4MMwVOR0bcBAcjruP9CYn8IpZO/Nob2gcrU93XbDwEvJwlmdbrnhMA7kY3wY5RlfDaqUXjA/fZ+BIZu4GeQY0U6mshcg7cJVmS+e1oTW4MxthLZsNGIw3TNgUmxPshxggPyJcJYYgl7oNL3c1BJ/ddx5VyWFqf9n2i01pCofxiBcG93fi6SQnejkbjG3X8/lHV8l2uTZ2I6vZxH3sva3bXrhwhodwFnuedtiYDYi5i+BEmcHV1bu5ARejEyPg/0z/eBr8n2GjxT/MgdHq3WGjBxvatUJ7YmNMYOGWPLKfGfbmuJ1rb3kD/jaSwSYSfUqWn6MS7cay1pLXQvKvq4Bo28m0hCxVujApIVyBY4FDHn3Qg0G5GoPhj4NtLbH0eZyCI6DKmERe4dd0Few0FIErwcSZaPI+avQgWyd7k2rkajfz4yZA9FtkU6SZXOjwzTRALBS4DH3bYrc36NC7V1xJZBC1NSqjzdzpB81ZBXAziWDOQTaIRU3H2moJEMyMVKGYzHAi9DOf8HkX2xwr1LD5pR9ARi9jLEgKvdfV+DJMUAkhavR0w6DBlyWZqDkko9aIbVtsClSEXciqTJFASMLnf9VchA3RUBvA/FEe5EKesVSBW+BfiVgUcDo/BzlibDRvASoVkNGTsUBhElE4d99Y56f6NsCMYMhLwCViieRZ2mfwFHZw9aBIJU9Go2qgq+EpWcfQzp5BhVEq1BpWIHI4PsTHerXsS8a13bd0Gp7Bpi6LPJB8IKNHoPQ9KkhMT9v1CxSeSu8UmkuxA4DkFu7pHu/AbU591o+txfXTsbwIXZPIeniQTCtm67kjxr3thN1TDCQsliajY9DpsYb/KA0EuS30/TZoeZ0/6lowE0Au9A08Y+nTp3MbJR3okkwXmpc+uQt+DpxajcbA3qh7xs4BwEqG8hO+RVaHS/EBl+/8z5zdLUZ7X7zS/duZ1d+36IpMFvSGUx81TDRBqLfvr7o7QGkwDbXwoiYkw5MPFQYOJ0IjbVTptnI3gA1zPHs1Pq8qjFVvId49PGjp5Akbwb0ShN0/fRSAXZBGsopn5k5G1AnshLScrPPa1AauV9CDjHoVR7ndaZTFn6BFILD6LBcR9yd32+4wfIiPwH5EsDmFggeIkwQF4ZmWGoEkQEWIaiko2isDcrEWJr6FAcoY+4qal+BvK4VjJnVGeMbIlzUD2hQYGlGqoEKqGSsUtpnmaWplcg78HnFWajQfGKzHVdiJERGt3vQu62RcGg85CnMifnGcchKfJbZDPsjmIX9yIwXUVKFT0V7mPacGsGgjUQNjZ2hg0wBAONckRUKqdCzLoMCIwtBSbOAtlXO2U9h17yCzVNwf7wgYLQ63zElLegkXq3e68LkJ/+bSQxrnDNfXvqtx9FTFqEpMccBIIVbpueoBoju2UaMgZf6N7lj+75ByEplNZexyHxfyzyKL6KahtvQjbLNciW+SKKhehdC9KPE2UjdCBXzlv2zcEkuY+1jjBSmbphCGNzVYOFwNqW5vt2Z8PMU8lPPK1FHb0lSVFnC9lW5dmHMnwRcjFBo+y77soDUNz/XJQUOoYkfHwLGql7IgZejozI+1w7X4LyDxvd52R3j3nIJdwG9d8WiLlrkJF8NPII/ubuuT1idp979q0IPEeTzIUcrS5lwiSC19W+tKo50OMkQjWs07ABoYlrqWBSlvJsBB8vyAaVQvLzDTUkHi9BndpCBVLhVGQfREi3vxbp5O1Qxu9Od2wLlIvoQ6J8MRrZG5FkWI0k1XGIob2oarnXted+ZGQ2kAH6PuSF3AZ8GFiAYgHrkPr7NJpGeBKyAY5HYLweeR7HAWcgG2M+Y5geP1ESoddtfeaxxb8PjR0qG4sxlsGo1CAOq4TDc2JHcx/9LOF1Oc/OsxOmomjiNFrjDz2IcZ/KFJyU0Ijd0z1vTwSm+4CfIGPSorjBHKTHV6F33x25j5vQyP0qyeoqvSQxlWchgFRQOHojilnsjwzAtyED07//TPcuHwVehwJLDRTN/A0K589CXsYKFHlcxBjc6okGgg8vt9gIgYn7QmcsDjTK0Ch1U0qcgFRcOQ8IfsJrXpg5bxr4FCQui6beL0croKQjzL3u+mUkKe4FSB3sjEbbXSiGHyDj7AfIdjgDMfFOJDmuRXGIgxAz7wP+B4n4w929HkMgXYYk1wzEwEuR52CRcfoRJG2qKGj1BhRm3uCet4vrnzuQxFiMJNjuwL1FOmKigOCZUZCCDqiGjdqUklQDxjobwZ83phaHnvt5bex027wwc95El3QN6hNIl1YQwLZCRmC2NnALNHIfd8+LkATaHkmW9SiOPw9JhL+46+cjpn4I+fYPIWPtVwgUVySP4O6ctmZpOlI3v0b2SSeyDWYiCXASAsVipIIXuOvmIdtoD+RdXTrSQyYKCF4V+OBJb9NZY4ltsDG2pgRg5P82AWEwKmGMRQGlFmPRj+yxAiFNV9O8vEzSLJpiCT0klUlbIP1/IOrce5Fu96VjpyMDuc9te4CvIFVxIvAjNPpfjdLYL0H6/CMo4PbVEdobuPudimydAxCw+0jK2qrIEF3h3n85UkMV97xNjGIPThQQ0lFFyAZ64oBK2BgsB1FFs5haAkOA9XGEjkrYGMzUI3g7YF3Os0ebA+mlyRbo/QOkZ5/QU4cReQsC6FbIFdsKGWLT3XM70AjcAxmD+yDxX0Yu5S1oJN+Ewr//BN6BjL/bUFzgr0hl7YUkyAIk0n1+BsTMh1A8Y737zUMkayy9A6lPX4fQ6d6pH6mMTyM7Zbl/vzyaKCD4UemNxewiFlE5iIdKxvYC9EflGBtsmQ4oKeBsKJm4XA6iRsZM8F/yJMJoqeiX0dofS4EdLZpl48rZS0gHr0EG2AxkMM5z77MTGoHdCCRr0cg+EoGqm6R/H3L3qCD74Ysom3kCYvwCBMbdEVNvIJnW7pNWR6IQcj8CaM3d/3Bke9zijnmV8U13T4NshBIjrFAzUUDwNoF3H5uBYE2tFESEQdwNEMemTsH6yjEmjFvjCL1um61bhM2b32DcJy13Xobcsh+7th2FpMEqBAD/17qeKf0obmAQs6eSzFTWq4ipX0KAORWpj3kI0M9HyaG/Z9pmkfQ4CoHmWBQtPBSB5XB33/kIRPOQ7TEPAeCvyIDcFbhnso1FLxG8iMvkAEyjEsSUTVyNFUcapFmHjVaP4K/Nq1scDQjXoFDxdNRxFSRy48yDO905v93RXbeexP3rR7r/QdTZP0VG25C7d3q6WpoiVMNwNIobgOyWjyMmn0AiEYYQqN6DAPiwa3uEgDEdeSHPQ4D0tQc9yHboIQFtIU0GEHrIGirWbHAVzFNjawiwNYqjX0VpaMh3H0ezEVaRKdSAZJZTylj0lUkgIHe4U32og/vQKFuHxPBCxPgrESMto69o9o6cY4ciyfAyJFGryL54HnIV90Crri5Huv9A5Mlscu1d49o7jWRtKUN+tnaYJiqy6Oc59pFnxVtTL6sWoROgFocR1nSmrvCMl8puVQ0+5l4EhM6c46NTs+VQQp0bI1U06D4BSWbQJ9TuR3bAi1zb+pA1ny3GSdN8ipNVCxBg30fSFy9DKuK5CBQ/RrmIF5FMbPFzGAbRYPFV1jH5K7sM00QAYQrNzM8BQrCuEkaUw6g7xjAYlQzWtHSatcShiYNqqW4yTPJAyLMR/EgoonnIcv8sGllfAz5kkPyMGO75fsTQLpJ6leXII1qB3LXfIQZMQWphF1QoMhXlI66jOIj1EKOvMn8e8D0kZc5F2cv93Tv+1L3Ho+5ez0Z5hukIoL7HuhFo18Pkeg0+D+DRmVcs0giwBMMLZ9g6uTaCaYTGlrtK9TBHc5TIlwg+4ZWuck7/eBcEgDQtR52eDir1ow7tQta2X5dgHmLg3e5eb3PH9nG/29K17dWoBiDHNQYkbRYy+hrSD6JKpNch+2Mnkvf+OVpq53fuswbVIdzl2tRAkmHtCO0AJhYIRdXLYFnfVaoTmrjLWjCGOvk2QmyhHFmT5/Z0kQ8EyF/q9xaks7NSZAYyurKRxdXu2AzUoZ3IUFuHmP4BZEBOJVmu5nZ3r+ciL+DhgvZ5+g4KRhXVWi5HLuPzSeyAA1Ho+VY0JW4BkkjfQNHDFch4fDHJDKvF/oZF9QgTAYRet/UjMsdgMnWtjWCrYLCWGulcu8EoqjiMaL9+QhosU8mf3gat1cxrSOXki8j7kI6WIYnwLBQU8hHG3yAgrCKJk3wKGXmnuXOvRAbpaP27GEmnr4xwvoGioZsQ8M5Hg+AIkil3b0b9twcC1suR+rjJHRuEkafGT4SN4JngO6k355p+l3buNMbSH5VDbDDN+FS0NeVGHAI2IplKnn2PKcP3Km5DlrZEIvt0FKodJksyldw9aDkC0H5I1N7vfvsLkiX6QSpjnrvmPtTpJ7lr64y+ftFzC46fjwpUlgJvRJNsTkKS4HqUs7gCSYD7EfM/79q8DwLNna4NjzAKTYRE8BLA1/G1Gm7WDE4t1SgHcYe1YG0wPDHVGIu1pncgKhMY6lhTonl9JU9pIGQNzTwgnIaKQ9O0BLl6N0HrugjI/X0OCvj8iWT1sstJ5kechaTGVqhC6SWIMVNQSdoVqAC1iPLKzz5NYjvsjaTNTHfftyJ1sDtSU4eioNEKXF0iSRndFCTVbvE3zitchYmRCB4IPqrYm3PNkMGAHTYWfSjUkwGLhTgM4rCzVMvUlQLJCm1jkQjHkIBgA4lK2QGFc+f6wpSU1wCyxkHFp5eg2UdHIc9gBzT7uJ8kX7UMifmDkIV/FjIoizyH3WgtZH0TCQjmu+e9EamQexGgr0IuZMPtb0L5jS+53z2CPI2jUSZ0rUL2xTQRQPDuou/sHFfObKqW6oRBXLEYAmNd/zdj1VoaoYlLXWEjxLaUMPkC1rz1ELKeynGpfR+AOc19fz/JDOPsaLkLAXpv9/0y5C0cjFRGjUQyfQO5c9NRjcKHkVdgEXDyaG5qf7lr27dTx85EwJiFVMVM5JL2IBvsZe66Nel3QDGG69w7XuMP5ki8YZoIIPjMY8uyu8NkaXRqRbVOAz6OUEkFC4YDShYTRtbkAdqrg7ww87aZ72lX0gdxFiIwfRFybQRPD9K81P7DSATfiKSEL9v/FbIHvuja7z2BCsor5JEHQgNZ+demzp2JhNSpKGZxEjJ4t04903tAr0eq4ovuFZajBNly165RaSKA4KOKHghNsX8LYGxfRxgRW9NpjKUelUKsSa917KnB5hmLWYlwLhKRoM66HMUbmqRJxmvwdAn5Ubkqkgqnu/b9CzHqbASSbVFB6t7uHVpmV5EsqfspmpfVfSUazWvQyF6IDMdtkbE4A/Xrje567xHdQTJ14TBULNOABOhFKmIijEVfH+e9hkwSyICxtbKW3u8AYkycYyMAUtmd5E5ULixph1YptBZ11j+RmD0CifyjSWX7CsTmb1G8ohsBwsc0KkiUb0KFq7ej/vwGyUJZv0U1g79z+29AkUJPHvwXpI75kf8rFETaCtUzfg8BYT3wByQR1yBjcXZOu6eTTMPvArYxsKRkiOs5LzoREiGbgm7KPKpkPF5TDRvEyi/kxQg8RVgqWDNI62QWn3jKCzP35hxbgqz7y933qShpc4a/INMAL9pryNj8JEk18EwE+LXofY9E1c1/RSL9PGS4neF+cwES8Ytp/ru/XyPd7qucT0Fex96IN59D0cNTkSF6H5K4OyFw9LpnXpx51xnIsL0ODbazgbMsxN6qzdJ4A6GTBAj96OVaE0CGemhiDFQacdDob5RJahYNgAmMxWLiUhCHXeVaXju9sbg255xPwWbJIn/7valjF+As94wxdQ7yALZFLt7xyAg8HI3Wj7rrfLyhiuYafgypjD2Q27gMBXy+i4B3orv3zu76fdGoPgHZGKeh0rbd3f0/7/ZfgyTaaciFPIb8f63Z27X3evf9fCRZbvBAnwzVsCXi5GDqeyuZeF211MAKrUOx4gRTh5tpDTX9oUsjMLbcme81+EKWdTlP6HHPTkcet0NSZS0arXeQTAU73cA/Mw9Yizp9JTLi3ojE8kHIPUsXoX4SgelSxPBH0SD7IPJKKsiguwIFevqR5LgcGZ/nISPwHcgtHUQewceRK3wVch23RkUth7jn5gWKXuCedaV7bjeKhv4dkireogKP8aJsQUpRkUi/g2UVqLkpbSG+gdaYoUbJu5WhA0oWCP7eeaohJJFM3UhvL6f5L/geSu0PS49UJ/0GuYv3otG9FEXsHkAj9OUk8Yr3oAjhm1Dw5kFk/L0JAXUlkibvQbw4EQHmZ+4++6I6xg8gSfEzd9/PIBvhD+75Z7nnf43mZXh2I/kTr58hu2Rv146TEZBHrNMYb4mQrVXMebgB7KaypsSXwTTqNsFA02XJ4pJ5QPASIS+OAAkQqkifgjplDtKrJ6eu/T2tD5iNRvYv3OcTSExX0QSXDSjI8ziKTF6CRup7kU7eGTF5Exrl16Gq5echxu3nnlNxn28gW+G6VBvSTToFRRyvQAt04Lbbu7ZshcByOVJBV7v2v8E973JGoIlQDZAYivlZNWMHO4MGQGdkTWNAf+uTd+VIuQY/GvMkQvr8KhQm/jvqtANozjOcD3zP0oK4ARIg74Qmr1yKmH8dshVejgzAC0kAtgxFHKeh7OI1yNM4G0mUT6F+uQf4AvIuXuzal32X2SR/8DUVqZmXunNnuvbd5p4bIQPx2Shaerw71uvascwyeQtueiD4AE7BHAMzpIUx6AQGjZbOKoojeEO3KKBUBIS0WnoYic7XoIqeLjRafoY6Ta1qlkmXoPDuH5CxtRpZ8NuiEbYnyT/YnYJSvi9G736Pe7ftUJXRz1CI+w3InrgAjdCRRul2SLqsR+7neiTZ3oZsl32RgbkABbwuc+9UQ6Dytsb1uKLciMlbTMuPwuIUtCbA9neGDSIblA0MGmwHzX/rOxxZdNuRgJAXWYRWFzJC1viPihqf00EfRFPTzkdewsWIKWciJj0LAfjHJPMk6mhSyXokNU5wt/46msPwPBRGXo1qHR9FzNwPSaEfId3+XpRIutA942DkPtYREM8imd19gGvbjSSTZYZrIXwQKbLFhaHjDQQvSr2NkJN5BLCN0FgsVGNrNg1GpUyuZ5ii2Bq6SvUBgrg/Y+2OBoQnXdaeIzUfQ6PwCKTfP4JS0CejoM+f0YibgiJ5VaSft0DGYzeKAUxF6uIGZOR9GAFkN2TU7YKM0kVI709Do3khAtvtSPr8Ekmix92x09HIt0iC/b7o3SKKgzUw/kDwBlpxChoTE8QbKwoodVhr6vU4jKF1wWVcNDHQAhpFxmJeZBGexB95+A7KEztI1N6PxO90lIjaDTHgw8gGWIjCubF77iz38dHGBe72H0J2wrkk6evnI1d2ORrFQyid/UeS0rMLkbi/DEkpr3IGkJH5KPJsXk3yL3g3k/KMigDgaaIkgjcW82oRYoKoUTIx1poKUg22YC2PCMBak8cjH2Iei40wKqX/jSVDXYhpXyJZ5OIiBJAOxNxzkSdxAGL4dJJC1kE0wq9HjPwmihFchLyQXyFx34vWY7oBjfzbkDrYFdlKs1C8YRAZpK92173Znf8nmjp3F4qBfB5FJm9MJ9Qmy0bIAiFncSszUAriDZ1hRGRNNTR2vYVpYMPWa0f8zwZvU2wkX+qNCQiWlvkMWZpFMuV8NurLHdxz1yAv4GiUI7gPuZp3oMDOwygKeIDbvxvFFv6FrP8IGX6vQqny2935q1CS6WsoSVZHKuG7yG64FwFnLZIkN7t734yAc5t73unItbWG4XmEuTTeASWfHvWZvlYgWBpBENfDIMZiOiJrhhRizr3fSMaiD133kZ8dHG2iy/DaiqWcm6doD+QanoNEcohsIIMY8RzXhiVoxC5C+nwLBJQfoYDOFOT+HYskwruRxLjc3esSd+0/kN2wI1IDTyAVdLa7jx8clyCJ0Ym8moNJluWf6Z63klQYeiT1MJ4SoZck8+iB0BoLt6a/I4joDBrE1pQDw0CcXUWrOfsI+UDoTl3TT6v7uTUS3YVTvQLG1AGnI6bejkb2amQjrEeh3DsRIPZCDP4FGo1VBNC7kSTZBzH2pcjXvwd5H19BsYTL0EBahCTODxAzp6MBtRKBcKl79+ON4gcLrQzSU5FHUkFBrAPcPYZVZ1EMgbH1w5jJ2wN1kmhfXlJkmDEakXYwNDYLBE+jqYYqMpg20uqq9rjPKnIorRKKHo5G5ZXAH42YO4j+jGt7FDoO3bP9RNiPIgNwAwLLrUhFfB8VoeyI4hBvRMxeioI9+6NBdAFSafshA3A2YroH3s7ArUZA6othoYvNf8fAJVbM91L4l7gydkNxjsHTeEsESOyDkFzVEAx1l2pUwwbWGupx0DcUhZ1ZPgeKNDogmDwV1oEYPUB+4qni2pQLBIP86szay1laDHzFd6QztOoBPJyTybsMie63IqYtRZLkne7YEUi/z0CifB+UQbwY2QTvRKrlTqQ+lrj7VpErug1a+qY3hoWR5bEYdrD6z67loaHfNK/42sR0//d/kwkEP8Npa3Ln/pmB0FgCt5DWUFTq7290VFJ/BwzGMhSFxNZEFqiG9UGMXa9/dGli2VZIDRV5Djnua0IWmdtlRtafDZoXsjYk6zY3vZlUxGf9vVP0LBR08sGgH6EU9DkIqB90zbgIRSdnkvyp54CFf3iwurbsgAzAIQNzYlTn0WGame3B61XCZNkI2TL2/PCypR4ICL6ydxBlGZtoKCoRWxMbYykFkcXYvClbntFFiacRPQeDOnDEuWAMS4LZyMJfYuGiyBJ7V8x3fpjqaUNTx38kfT+bXOOl1efdB9xcS0uzgRSjoe+e5aOjrwZW+OdkK4/SKm8y4wgeCE9kvjeTDfq7SzU6w0alEQcY7FCQNxErpRqsNQE2V3p7g7EourhNwfEmGsFGUFO0eScK4mAU1v2r/+2w6ki1MCDV+UaA8y6c/+dW/zfA/meOyf24e6Vdpji51cGoRO5Ymv8UvOU9RmN+msYTCNnMY2/BdQ29uO1Up5jBqLXoZCxeA4wOhIKkV/7DRqHjU/uvxwHB/zZzj8ACsedNuuUpMe3/kDPvxdISJaPbr0V8a5GiT4bxWRrPOIIPL69123z9HAdrukt1qmGjjNZYrPU1OqY12QgJjeQ1QGKMFoWZ82Zibw4dj1LRS5GaPpnm93s2CuK8E4V1b8HVBxp4u4E1Rjr9ywaOdR7I21Mgmm7gp0a/qRkFpz6AilDSpfQ7ounwaxH4z6N5MB9Pkh85G/XZEmSojkjjKRG8GB4hzwBgGqUgJjS2o24NFmo5C2F4GimgBAkQimyE3hFbPHZ6ndt+CFnw70ORwO+549MRGL7ivn/Zbb9Ac33ku1AauYTiDqBYwU0klchlZEj6QepV7D7uunRfvQ/FLvZF7uvOiA/fT103GwWt5tJcMt9E4ykRZrmtT0H35l5lWVsNNbnFWQZDI6zDnFYNeeTjFEUS4UlnIHNoezTPAJRPuNTtvyF1jQdsP1JH70GM9iA4BjFmHslUfv9uH0TMuhUx3dC8pI5XewvdufPctgMluvZCgEvfcwhJD0Py35AvHuklxxMIPqT7WOZ7hsxgWVPiy266WyMwNrsiiicZi/oXl7wrPBDW55yD8QHCa93W1xE+iBh+CIr/p+lmEk/Ad/z/kKyudjdiPCTvc5Dbvp9Emn6dpDj2ceRJLEDFqh9wx+tIuoBS2pBIxu+SLHb6B7fNK/wZpvEEwti8BujrFBAqgeIIQ/2NcrXQRrCGjjCqY2zejCavGp7IOQfjoxpOcttj0MhfQTKp9US39UxNt9FnR9PT7aC1/D6dPEuTlwQNEqM4Gxzz9/L94CVCuj/y+q2FxgsIVRIJ4BtX4D6awUB/BVwOsNTjcKgWlSoZ9TDsNcRAV1hvFADB2yHrCto1YkBpDHQQGomQTJQuk6xQ5m0Hz8S0/varqJxIMx2dufZmtz0ldc2s1HU9JFXhC1BAKnuvm9zWj/oWj2I0Gi8gzCApFBkhBQ3AYFdYJzS2I7KGSlivlcPI5NWlxBjbEcR0ho2owKDsdduRClhHFImjkF8P4XNoVE5BHsxUlGreGdUdPJbz298iVTAf1QqcjFTEG915/z5fd9u3oqLYi1E620sKP8A+57b/QGrky8hugMRGSJf7PSkaLyD4auV03D8v4QTW9HeWGoQmntFVqtOw4bXra5WelgSkNRjL9NDEv75+9ax7iUqzg1aj0s96ztoIPtb/L0b5T+QRqIeEad476CcxDL/jtqdSzIBjkDg/EGUCDyaRAL7v70EJqLtR9vD1aFGOqzP3+ggKQW+NCmHe5Y6fgeZgQH4oYUzhhfFyH3dw2/NSx3pzrwyixiObptHf6Lh2685N25916yH1eOMWO5ipTarzJx1hg+2mbPjMJQ/vteSH9y+Aap/XyxEaMQ+Q1OgtQ2L6EfdZQSK+NzfOEqIVTx4lfwXVi5D4X+M+h9G6XN5DyHo/DtUyXIqA8SKSRT8PRwPoUJTd9NLNJ53S0ua/USHtIcgw/B3JrHOQ23kfqRVSXDtvIZk5nUtjBcJMNMqyE1E9XY9cID8FaypizirUiStxK3dQGfzD3x6dQ2jsiitX7MzFd7wAujZOddxaAhyONfd3l+pQGbj/1w/Pg74egi0f+wI26EeZunWZ529AnZBHI2ThR6Q1jFAMivrjytT3PxVc109r5fRlqf2DUfp6A6pGWo1G+2x33aLMb28lcQmztIJEOnhaRvK/GYU0ViB8C4m5XyN990c0GrxRsjRzfR8qyszJIcR0hnWuXbUdn7v1UDCWoFSbiQ1uwi8sZQ2lIIJyjb44hFIdbFDE6CdDZVRtNB8FYY5C6uNN43DvzaWPIdXyfjTnwdPVaB7GpJAJTjhvAxrBfo5fHv2c5lg7CME3IgPnRiQVsqKxhSwQBjGlOGSo3oHpGAAbbIWkjRIuUZlZ3WvZZ8vH+NvKHdhY6yQInpQhXEW1e3PRPMW57rMrrZ7En0lmDz2VtA0CZycS73dNwjPvQf2zcawS4cfIHdyFJII4DQVN0hGr+1EV7vXucxuZxaANEEchg1GJoFwDG0AmDhCUB1mxYSuWr9wBM2W9rotz7dqpyJ1KM3w3xPApeT/Ioayf/1TRSppVxqTSWIFwKUlodQ4qrXou8mv3JXEVd3MfP8G0n0Ra3IAyZ8ukDkaoAohDTHkIU3YYioNeJK3STN8NAXMsLtM6FBFc5LYPpL7nuX7PONocr+Eh9/mJ+15Gbs+BCBT7oUwdKDR6MM2rhNyDJmt4YNxDYktUkW8+FzF+Lkrm7MXYXN2VJCulP4AYfZd7RmOE3z3jaTzcxzoybNJ+7ywEiOe6z74kgZE93OfN7vtjyGCbgcq4RwsAbUIM9sz2DF+EjNbN9RKe0TQRi2mBauvTS7sZJM7T4NgHGUYzUbVNlpag0b2IZoY/TLEb26bNpIkCQpYsEs/3kCz8VEFgOAJJjEeRurgDMTy3+rhNE0OTBYQ8GkKu53WjXdimiafxnvLWpv+j1AZCm4A2ENrkqA2ENgFtILTJURsIbQLaQGiTozYQ2gS0gdAmR20gtAloA6FNjgKSPP1sxrieQJv+I2gayWzxWglNmDgWFZH8GRWoVtj8+QBtenpThMrmjyKZjXaTCU44bze0dNxmz5Jp0/952ruEij92QXP7j0CSoHBtwjb9R5D+XU8a4N3Aov8FSwI0h7A4SXIAAAAASUVORK5CYII=',
                 width: 60
               },{
                 text:'UNIVERSIDAD NACIONAL AUTÓNOMA DE MÉXICO\n'
                       +'FACULTAD DE ESTUDIOS SUPERIORES ARAGÓN\n'
                       +'SECRETARÍAS Y UNIDADES ADMINISTRATIVAS - SGC\n',
                 bold: true,
                 fontSize: 14,
                 alignment: 'center'
               },{
                 image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAACBCAYAAAAMl2JTAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAALiMAAC4jAXilP3YAAAXIaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDQtMTJUMTU6MjM6MjEtMDU6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA2LTE3VDA5OjU5OjQyLTA1OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA2LTE3VDA5OjU5OjQyLTA1OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5ZjVkN2Q4OC1kYmQ5LTQ1YzgtODQyNC00ZWY3MzEwZjhmZWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpjMDEzYjUyNS0xMTFkLTc1NDMtODZlOC0wNzhlZDQyY2Y0ZDciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjMWFkNmNiZS1hMzM2LTQ1OGYtYTVjNi02ZjJhOWI1NDRlMTQiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMxYWQ2Y2JlLWEzMzYtNDU4Zi1hNWM2LTZmMmE5YjU0NGUxNCIgc3RFdnQ6d2hlbj0iMjAyMC0wNC0xMlQxNToyMzoyMS0wNTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZjVkN2Q4OC1kYmQ5LTQ1YzgtODQyNC00ZWY3MzEwZjhmZWMiIHN0RXZ0OndoZW49IjIwMjAtMDYtMTdUMDk6NTk6NDItMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7kuXm+AAAOsElEQVR4nO2deZAV1RWHvxmGQXYKRCGKihqJK8Q1QY1JcIkxaFyIUIqJmpSxghO3iGAKJC4RtVwi0YpbcInGiIpbNGqMqGFRcV/QIKAihAEEJAiMMJM/ft2+njev99uv+73pr6rrLd19753p3+u+99xzzq2pH9yAxcHAJcB+QC3wJTnVSJ31+howCXjK+eU44PKiE7YoT7tyUmIo8A/g98D4OuAwWovgU2AZUF/+tuWUgSZgS2A76/M4YG4dcKbjoCusHTnVz3jgMuv9GTX1gxsWA9sA/wV2ADam1LCc8jMf2AlYWgt0tb5cTS6C9sYq67W+FmhOsyU5qVJjvbbUptqMnLSxhUAuhBwgF0KORS6EHKBgWcwRvYFdkbFlK6A70BGZ29cCjcAC4C3gi5TamAi5EGRZPQb4DrA7we6SG4C3gVFoLD4U+AVwKfBhMs1MlvYqhI7AecBv0F0gLFsAfYDFwPVAA7pLVKQIoH0K4QTgDqBLzHIuB64CxlifL/M4NvO0NyHcBpxmoJxFwHHAkdbnNcCTBspNjfYkhIeAHxsqqy+wtePzLCSGiqW9COEazIkACvMzNnMMlp0K7cGOcChwTsJ1zEq4/MRpD0KY4LGvydri0AK8F7OM1MmSEAYiI45JDrY2J6uQOIYA/dCzfjfU+18YoY5FwMeRW5gRstRHOAK4AT1/RwATkbPMGjRefw+YCbwSoszhRZ/vA0aWOG61Vf4fkQ/fhSHq+CDEsZklS0J4ErXnSeAF4OvWVsxK4EFgCvCmT5lDHe//BPwyQDvGWXVcFeBYqILHAmTr0bAUWAF8DzgE+MzluD7InPsGEswgl+M6URDSWwQTgc3VwPSAx74dotzMkiUhbAQ+t97vD3QLcM5BwDx0Oy+mL4U+x+QI7bki4HFvRSg7c2RJCACbrdfOhHOnvxB4oOg75/l/j9CWOfhf5JXAOxHKzhxZE0LHGOceB9zo+Pw/63UBBSfNsPhd5FeBdRHLzhRZEkIt8TuvZ1Kw/zdarx1ilLfeZ/8/Y5SdKbIkhA4Eu2gt6Jb9LIrKKuZ8x/uZwPYx2tTPZ//0GGVniiwJoQb/9twD9Af2AoYB2wIHAq87jvk+hdHCndbrXhHa0wXY12P/w8D7EcrNJFkSwmYKncVSnAuchOIyncwEvokujM0Q6/VW6/WCCO0ZiUYeblwboczMkjUhuD2Tp+H/jx8NLLfeb+so82QkoG+FaEsv2kaHO7kbmBGivMyTJSFA4UIWc3OAc9cCU633zr/rdev1KRQFHIRHaO1v4GQlyc9mlp2sCaGUuXYdwecXZluvqx3fPYMeH/OR0I71OH9v67jiiSonJyILaFWRpbkGkMn41KLvNhI8ONeO47TNvvci62J/1Bn9EM1TfAT8BV30ZuS+Phxli/HiaKpoyOgka0J4HMULOB1Le6Mp6iAWPHuSaQ7qE4wEvm191wLsCNyOxDY+RLsWAz8I2IaKJGuPhkbkYFrMCQHPPwW40np/H7I0zi465jTkf/BQgPLs/sAAqlgEADX1gxtWol/dPBTlkza90fjc2bFrRrYAr4txMzIzb4ksjBdRGD240RMFuAyxju2C+iQLgeeA58M2vsKYi/pFK7L2aABNP48CnnZ8V4s6fEcBL5Y453501+hvfb4Abxc1mzVoaDotamOrhSwKAdTTH4ayftlt7IE6ky+i4V0T+jUfhS7oDsij6UJ0S7+9rC2ucLIqBNBcQl8UQfRzCtPKB1kb6JFxDnCd47wRtJ6FzAlAloUAsgf8Ck0kHQDsjATRCLyMhoFOfoJGB6U6nDkeZF0INutR5+05n+NGA/9KujHVSNaGj3Hoj6ac87tBBKpJCKORJ9K8tBtSiVSTEA4D/p12IyqVahFCDzRf8LDfgTmlqRYhHIFGCxUflZwW1SKEQ4ElaTeikqkWIeyJf/hbjgfVIoSt0YokORGpBiH0Qqbmqp4mTppKsSx6sTPyQlpa5np7Iu/pnsAma6uh4I1d434qHdCPsNl67WgdvwxFT5V9Pa2sCaEG9f7DcDoaPu5B6YAXr7qIUB8oZP5836Oi8QWK3L4rofJLkjUhHItcyOajyaUaChFQLeiX9iWKa1yHfAxtP8MHgEeRP0N36/xa2l7oTSjIthk4A01Zh+FGWi9/ZJouKDCnB0rcURayJoTFwD7WFpaulM6G4sZswotgB8LlWYjDZORw0+h3oAmy1ll8iWgh7FGYEuGcffF+9pukK5o/KQtZEwIovjFpGgnmvFqMW9BLUoS5w8Uii0J4kLbxjaa5n2hp9sv9/9oX72AbY2RRCOvRhUqSeyOeFzcnYxR+Wo5KsigESPbxMJfo09VBV8TbgBxqV6FRzFLUEf4Uhd1tCFHnKMznn2xDVoUwC/kkJsFfEyq3ETgeeUr1Q4uqDrC27R3bAGv/jmixkLF4T5h1oQydxqwKAZJxOVtPPEON1/9rDOrf2ElC11nbF8j20YzsIBut/QuRe/6VaNLMa5hoYmkBT7ImhBoKq9TPwDtxRhSeRh3Rzsjo1IO2mda98Ert81KMdn2Gt6VyN7TcUGKkLYR90MV5B3gX5TVejH5FL2K+c3YQ+uUtR8/rJdb75QRbHN1NCGuJnrnN5i7Uf3GjOErcKGlaFgeivoBbSr3OCdTptn5TZ5QhZQVwi8f5bkJowsxE0a24W1WPQbmh/mOgnjakeUc4nXh5FZOgOIl3MW7/r2bMrLE9De+8jacYqKMkaQohi4uT+90h3e4IdR77wrACxX26cZKBOkqSphAeT7FuNx712e82Zd3ssS8sz3rsG4jZJYm+Ik0hzEFZ1sMYV5JiLQqmvSni+Wvwz9IalJk++xOZf0h7GvpWtAbjNshwUof8CDpaW13R1oGCj0IpXwOs/Zso/Eo3U/AgsrcvrdfNKCP8IoINVd2O6YaGvSZE/RoaObkl+fgRSgZiNKFX2kIAXZRFaTciIJtcvt8K5ViabqCOzehu6SaErijftFEPprTtCJWG1+3/TrToiAn8Mrf90FA9X5GFO0Il4TV13R119N5HhqHlyHi1BE06LbO2RvwfQ35rVXzXOsaYwS0XQjiCGLkG4b68UDNyj7Otm8utz6uRZXK5de6vferoh3w1jQX95kIIR5h8zqWoRemAvJJ9B8WoEPI+QnBGoVxOWWGIycKSvCNshcbm+6EV1+whm3NY56TF2l+H+9Cwhdbu7W4EPc7GHnK2WO2zh5ZNVhl7UXrpwTTZxWRhSQlhAFplpWdC5efof2xHS8UmqUfDWHIRJE1fgi874EtSQhicULk5BTrhPq0emqSEkIQvQU5bepgqKCkh5KOR8hDGzc6TpC6Yibn5HH+MOfYkJYTcUFUejF2//NGQA+SPhkrHmLt/LoTKxliKnaSEUK4cAu0dY25++bO8sjEmhKR696Y8ekGOodNRSNkqZETZm8JCXlmkGXgCeRotQcO8XVCOqD0M1mPKYTYxIZh4djWjOYurXfafgYJkrkPOo1lhKnA2EnAxE4D90XpTu8esp4VoyT5KktSjwc3JMygLULZ1NxHY3Ab0ofWKcGnRghxYT6W0CGxeQneFuKvNb6AChBDnlvUhmrQKmjOxCTic9JfsOxCtSheUc4GJMerbQAV0FuMo9XiURzEsI5APRBqcggJ6w/I7oqfxWU8FCOHziOddAbwRo96zYpwblenEizE4m2j/rw1UgEEpSoLsZqKHnNnMINzt2QRR8jU6aQRuiHDeopj1tiIpIVyDsoCE4TngYwN1TzdQRlA+wjtoNShRkoddbqDer0hKCI3AIXj3nosxtd7CK4bKCcIbmLGZvIs6yUE5Gv9oqFAkOV38NspdPAKNAk7AO3OpqTT7QXIXN6Fh3EcUnrVOs3gz6vDuiZYJcsPk0gDLgJ089t+NEo/PIH6anjYk7TewmkIqmjHo+X24y7F+YV5B2cJn/xPIKhm0xz0K91u3yYwvXn//cOAxg3W1odxzDafibmMwFTfgVc5rKIA0zLDrXtz7HTuHKMeLHh5l3ULCIoDyC2EJ7v/UAw3VMcxj34SIZT7h8v0BKA4xLoehJYlKcbeB8n1JY/bxBZfvdyF+uHc34GSXfS8T/Zf1usv3nTCT16jB5fuFwPMGyvclDSF4BW5eFLPs3+IeYBonk+srwCcu+8YRL75gNErFW4pHYpQbijSE8CbuQ7yhwMURyz0KzVaW4jOim3JBowi3BUX6AH+LWO4glD7IjTsjlhuatBxT/uyxbyLhTcXD8L7t30F0s7fNVJ/6HwxZ3o4ou6zbaGE6WvGtLKQlhJvQAl5u/IHgt/LJeOcmXIdWZYvLbLwv9rHItO5lC7AZCXyAt2PNJcGbFp+0hNACXOBzzGnIDjEJhaV3sr7vjAxUE1FmMb9yxmLO8DMWb1+L3ZDA70eGKGcg8NbIJvEqekx5OfhOpox3A4Ca+sENK1FnZx6wazkrR84ZZwc81k583ZvgHkn3YD5b6c/wfrQ5aUJD5jrgawT74c1CfaVyMBe5/a1IOyLpHLTQxYkBju1ubUF5hmRS1k5Fqe+C3LrrkZk9KJ/gnw86EbLgxTwS9QlMMg0ZaZLiUoLfyYKyEC3mFXYtSiNkQQigLGInYsbRogFNdCXN9Si5lokV6aYh03hZFvssRVaEABqL9yL6MrjT0GMmipNHVOYgE/NZREuJuwANPUdgfrWaUGRJCCBfxTFIEGchpw83/8VmZJiagPIJjUDrKaXBFGTRHI46qIs9jl2GRg2HoqGmCceW2KTdWXRjDfrnTkHDxkHoYndDMRPLkDOH8Xn5mDxGwbC1HTIa9UI/uLWoH+BlP0mNrArByUZkln4z7YaE5GPMuN6Vhaw9GnJSIhdCDpALIcciF0IOkAshxyIXQg4gIeRiaL/YCb1railELvfEXGxBTmVg+0s01SLvXpCdfnw67clJgfMoxIC8W1M/uOFIWjtmLkQ2+07FZ+ZUBRvRvIgzoGZkHQremEQhe8dAa8tpH1wL3GfPNVyMlqKdBHyD0kvt5FQH9iq685GX1cMA/wdwu8tQP7+68QAAAABJRU5ErkJggg==',
                 width:60
               }
             ]
           ]
         },layout:'noBorders'
       },
       {
         columns:[
           {
             text: '--- SOLICITUD DE SERVICIO A INFRAESTRUCTURA ---\n',
             bold: false,
             fontSize: 12,
             alignment:'center',
             margin: [0, 0, 0, 10]
           }
         ]
       },{
         table: {
           widths: [ 100, 280, 40, 60 ],
           body: [
             [ { text: 'ÁREA SOLICITANTE:',
                 fontSize: 8, alignment: 'right', 
                 border:[false, false, false, false]
               }, { 
                 text: 'departamento',
                 //text: depto.departamento,
                 //text: sst.departamento_id,
                 //text: this.verificaSTDepartamento(depto.departamento, sst.departamento_id),
                 fontSize: 8, alignment: 'center',
                 border:[false, false, false, true] 
               }, { 
                 text: 'FOLIO:', fontSize: 8, alignment: 'right',
                 border:[false, false, false, false]
               }, { 
                 text: 'ssdl.folio',
                 //text: sst.folio,
                 fontSize: 8, alignment: 'center',
                 border:[false, false, false, true] 
               }
             ]
           ]
         }
       },{
         table:{
           widths: [ 100, 220, 90, 70 ],
           body: [
             [ {
                 text: 'RESPONSABLE DEL ÁREA:',
                 fontSize: 8, alignment: 'right',
                 border:[false, false, false, false] 
               }, { 
                 text: 'depto.titular',
                 fontSize: 8, alignment: 'center',
                 border:[false, false, false, true]
               }, { 
                 text: 'FECHA DE SOLICITUD:',
                 fontSize: 8, alignment: 'right',
                 border:[false, false, false, false]
               }, { 
                 text: 'sst.fechaSol',
                 fontSize: 7, alignment: 'center',
                 border:[false, false, false, true]
               }
             ]
           ]
         }
       },{
         table:{
           widths:[ 100, 200, 50, 130 ],
           body:[
             [{ 
               text: 'NOMBRE DEL USUARIO:',
               fontSize: 8, alignment: 'right',
               border:[false, false, false, false]
             }, {
               text: 'sst.pasajeros',
               fontSize: 8, alignment: 'center',
               border:[false, false, false, true] 
             }, { 
               text: 'TELÉFONO:', 
               fontSize: 8, alignment: 'right', 
               border:[false, false, false, false] 
             }, { 
               text: 'telefonos', 
               //text: depto.teldirecto+'   '+depto.ext+' '+depto.ext2, 
               fontSize: 8, alignment: 'center', 
               border:[false, false, false, true] 
             }
            ]]
         }
        },{
          table:{
            //widths:[ 60, 200, '*', '*', '*' ],
            widths:[ 100, 200, 50, 130 ],
            body:[[
              { colSpan: 4, text: '', fontSize: 8, alignment: 'center', 
                border:[false,false,false,true]
              },
            ]]
          }
        },{
          table:{
            //widths:[ 60, 60, '*', '*', '*' ],
            widths:[ 100, 200, 50, 130 ],
            body:[[
              { colSpan: 4, text: 'TIPO DE SERVICIO', fontSize: 8, alignment: 'center' }
            ]
            ]
          }
        },{
          table:{
            widths:[ 120, 20, 120, 20, 120, 20, 33 ],
            body:[[
              { text: 'ACABADOS', fontSize: 8, alignment: 'center',
                border:[true,false,false,false]
              },
              { text: '', border:[true,true,true,true] },
              { text: 'ELECTRICIDAD', fontSize: 8, alignment: 'center',
                border:[false,false,false,false] },
              { text: '', border:[true,true,true,true] },
              { text: 'CANCELERÍA', fontSize: 8, alignment: 'center',
                border:[false,false,false,false]},
              { text: '', border:[true,true,true,true] },
              { text: '', border:[false,false,true,false] },
            ],[
              { text: 'AZOTEAS Y CUBIERTAS', fontSize: 8, alignment: 'center',
                border:[true,false,false,false]
              },
              { text: '', border:[true,true,true,true] },
              { text: 'LUMINARIAS EN INTERIORES', fontSize: 8, alignment: 'center',
                border:[false,false,false,false] },
              { text: '', border:[true,true,true,true] },
              { text: 'PINTURA', fontSize: 8, alignment: 'center',
                border:[false,false,false,false]},
              { text: '', border:[true,true,true,true] },
              { text: '', border:[false,false,true,false] },
            ],[
              { text: 'ESCALERAS', fontSize: 8, alignment: 'center',
                border:[true,false,false,false]
              },
              { text: '', border:[true,true,true,true] },
              { text: 'LUMINARIAS EN EXTERIORES', fontSize: 8, alignment: 'center',
                border:[false,false,false,false] },
              { text: '', border:[true,true,true,true] },
              { text: 'VIDRIERÍA', fontSize: 8, alignment: 'center',
                border:[false,false,false,false]},
              { text: '', border:[true,true,true,true] },
              { text: '', border:[false,false,true,false] },
            ],[
              { text: 'ESCALERAS DE EMERGENCIA', fontSize: 8, alignment: 'center',
                border:[true,false,false,false]
              },
              { text: '', border:[true,true,true,true] },
              { text: 'CISTERNAS', fontSize: 8, alignment: 'center',
                border:[false,false,false,false] },
              { text: '', border:[true,true,true,true] },
              { text: 'INSTALACIONES HIDRAÚLICAS Y SANITARIAS', fontSize: 8, alignment: 'center',
                border:[false,false,false,false]},
              { text: '', border:[true,true,true,true] },
              { text: '', border:[false,false,true,false] },
            ],[
              { text: 'HERRERÍA', fontSize: 8, alignment: 'center',
                border:[true,false,false,false]
              },
              { text: '', border:[true,true,true,true] },
              { text: 'TARJAS, LAVABOS, WC´s Y MINGITORIOS', fontSize: 8, alignment: 'center',
                border:[false,false,false,false] },
              { text: '', border:[true,true,true,true] },
              { text: 'CARPINTERÍA', fontSize: 8, alignment: 'center',
                border:[false,false,false,false]},
              { text: '', border:[true,true,true,true] },
              { text: '', border:[false,false,true,false] },
            ],[
              { text: 'OTRO', fontSize: 8, alignment: 'center',
                border:[true,false,false,false]
              },
              { text: '', border:[false,false,false,false] },
              { text: '', fontSize: 8, alignment: 'center',
                border:[false,false,false,false] },
              { text: '', border:[false,false,false,false] },
              { text: '', fontSize: 8, alignment: 'center',
                border:[false,false,false,false]},
              { text: '', border:[false,false,false,false] },
              { text: '', border:[false,false,true,false] },
            ],[
              { text: '', fontSize: 8, alignment: 'center',
                border:[true,false,false,true]
              },
              { text: '', border:[false,false,false,true] },
              { text: '', fontSize: 8, alignment: 'center',
                border:[false,false,false,true] },
              { text: '', border:[false,false,false,true] },
              { text: '', fontSize: 8, alignment: 'center',
                border:[false,false,false,true]},
              { text: '', border:[false,false,false,true] },
              { text: '', border:[false,false,true,true] },
            ],
            ]
          }
        },{
          table:{
            widths:['*'],
            heights: 10,
            body:[
              [
                { text: '', 
                  fontSize: 8, alignment:'center', fillColor:'',
                  border:[false, false, false, false]
                },

              ]
            ]
          }
        },{
          table:{
            layout: 'lightHorizontalLines',
            widths:['*'],
            heights: 80,
            body:[
              [{text:'\n'+'sst.infAd', fontSize:8, alignment:'center'}]
            ]
          }, margin: [0, 0, 0, 10]
        },{
          table:{
            //widths:[ 60, 200, '*', '*', '*' ],
            widths:[ 100, 200, 50, 130 ],
            body:[[
              { colSpan: 4, text: '', fontSize: 8, alignment: 'center', 
                border:[false,false,false,false]
              },
            ]]
          }
        },{
          table:{
            //widths:[ 60, 200, '*', '*', '*' ],
            widths:[ 60, 60, 80, 80,80,'*',90 ],
            body:[[
              { colSpan: 2, text: 'FECHA COMPROMISO DE ENTREGA', fontSize: 8, alignment: 'left', 
                border:[false,false,false,false]
              },{text:'', border:[false,false,false,false]//***********VERIFICAR por qué */
              },{text:'', border:[false,false,false,false]},
              {
                colSpan: 4, text: 'CUANDO EL SERVICIO TENGA UN COSTO Y REQUIERA AUTORIZACIÓN PRESUPUESTAL', 
                fontSize: 8, alignment:'center', fillColor:'gray'
              },
            ]]
          }
        },{
          table:{
            widths:['*','*','*','*'],
            body:[
              [ {},{},
                { text:'CON CARGO A:___________________',fontSize: 8, alignment: 'center',
                  border:[true, false, false, false]},
                { text:'COSTO:_______________________',fontSize: 8, alignment: 'center',
                  border:[false, false, true, false]}
              ],
              [ { rowSpan: 2, text: 'Vo.Bo. de CONFIRMACIÓN DE REQUISITOS', fontSize: 8, alignment: 'center' },
                { rowSpan: 2, text: 'REALIZÓ', fontSize: 8, alignment: 'center' },
                { text: 'VO. BO. SUFICIENCIA PRESUPUESTAL', fontSize: 8, alignment: 'center',
                  border:[false, false, true, true] },
                { text: 'AUTORIZÓ', fontSize: 8, alignment: 'center',
                  border:[false, false, true, true]}
              ],[
                {},{},
                {},{}
              ]
            ]
          },layout:'noBorders'
        },{//-----FIRMAS-----
          table:{
            widths:['*'],
            heights:70,
            body:[
              [ {text:'', border:[false, false, true, false]},]
            ]
          }
        },{
          table:{
            widths:[120,90,'*','*'],
            body:[
              [ { text: '_________________', alignment:'center',
                  border:[false, false, false, false]},
                { text: '________________', alignment: 'center',
                  border:[false, false, false, false]},
                { text: '________________', alignment: 'center',
                  border:[false, false, false, false]},
                { text: '________________', alignment: 'center',
                  border: [false, false, true, false]}
              ],[ 
                { text: 'NOMBRE Y FIRMA',fontSize: 8, alignment: 'center',
                  border:[false, false, false, false]},
                { text: 'NOMBRE Y FIRMA', fontSize: 8, alignment: 'center',
                  border:[false, false, true, false]},
                  { text: 'NOMBRE Y FIRMA',fontSize: 8, alignment: 'center',
                  border:[true, false, false, false]},
                { text: 'NOMBRE Y FIRMA', fontSize: 8, alignment: 'center',
                  border:[false, false, true, false]},
              ],[
                { text: 'ING. JOSÉ LUIS RAMÍREZ CRUZ',fontSize: 8, alignment: 'center',
                  border:[false, false, false, false]},
                { text: '', fontSize: 8, alignment: 'center',
                  border:[false, false, false, false]},
                  {text: 'MTRO. SIMÓN LÓPEZ ÁLVAREZ',fontSize: 8, alignment: 'center', border:[true, false, false, true]},
                  {text: 'LIC. MARIO MARCOS ARVIZU CORTÉS', fontSize: 8, alignment: 'center', border:[false, false, true, true]}
              ]
            ]
          }, margin: [0, 0, 0, 10]
        },{
          table:{
            widths:['*'],
            heights: 20,
            body:[
              [
                { text: '', 
                  fontSize: 8, alignment:'center', fillColor:'',
                  border:[false, false, false, false]
                },

              ]
            ]
          }
        },{
          table:{
            widths:['65%','35%'],
            body:[
              [
                {text:'OBSERVACIONES', fontSize: 8, alignment: 'center'},
                {text:'CONFORMIDAD DEL USUARIO DE RECIBIR EL SERVICIO EN LA FECHA COMPROMISO', fontSize: 8, alignment:'justify'}
              ],[
                {rowSpan: 3, text:'\n\n\n'},{text:'\n\n\n'}
              ],['',
                {text: 'depto.titular', fontSize: 8, alignment:'center'}
              ],['',
                {text: 'NOMBRE Y FIRMA',fontSize: 8, alignment: 'center'}
              ]
            ]
          }
        }
      ]
    };
   await (<any>pdfMake).createPdf(documentDefinition).open();
  }
  
/*--------------------------------------------*/

static subrayarOficioSobres(tc: string):string {
    if (tc==='OFICIOS, SOBRES, CARTAS, IMPRESOS, TARJETAS'){ 
      return this.color = "green";
    }
    else{ return this.color="";}
  }
  static subrayarEngargolado(tc: string):string {
    if (tc==='ENGARGOLADO'){return this.color = "green";}
    else{ return this.color="";}
  }
  static subrayarCorreoOrdinario(tc:string):string{
    if (tc==='OTROS'){ return this.color = "green";}
    else{ return this.color="";}
  }

  static cantidadOficioSobres(tc: string):string | null{
    if (tc==='OFICIOS, SOBRES, CARTAS, IMPRESOS, TARJETAS'){
      return this.cantidad;
    }
    else{ return null; 
    }
  }
  static cantidadEngargolado(tc: string):string | null{
    if (tc==='ENGARGOLADO'){return this.cantidad;}
    else{ return null;}
  }
  static cantidadCorreoOrdinario(tc:string):string | null{
    if (tc==='OTROS'){ return this.cantidad;}
    else{ return null;}
  }

  static subrayarPropio(fe: string):string{
    if (fe==='PROPIO'){ return this.color = "yellow";}
    else{ return this.color="";}
  }
  static subrayarOrdinario(fe: string):string{
    if (fe==='ORDINARIO') {return this.color = "yellow";}
    else {return this.color="";}
  }
  static subrayarMenEs(fe: string):string{
    if (fe==='MENSAJERÍA ESPECIALIZADA') {return this.color = "yellow";}
    else { return this.color="";}
  }
  
  static subrayarUrgente(te:string):string{
    if (te==='URGENTE') return this.color="red";
    else return this.color="";
  }
  static subrayarOrdina(te: string):string{
    if (te==='ORDINARIO') return this.color="yellow";
    else return this.color="";
  }

  static subrayarSi(anexo: string):string{
    if (anexo==='true') return this.color="green";
    else return this.color="";
  }
  static subrayarNo(anexo: string):string{
    if (anexo==='false') return this.color="green";
    else return this.color="";
  }

  static subrayarLocal(idtst: string):string{
    if(idtst=='LOCAL'){
      return this.color='yellow';
    }else{
      return this.color='';
    }
  }

  static subrayarForaneo(tServicio: string):string{
    if(tServicio=='FORÁNEO'){
      return this.color='yellow';
    }else{
      return this.color='';
    }
  }

  static subrayarPasajeros(tt: string):string{
    if(tt=="PASAJEROS"){
      return this.color='magenta';
    }else{
      return this.color='';
    }
  }

  static subrayarCarga(idtt: string):string{
    if(idtt=='CARGA'){
      return this.color='magenta';
    }else{
      return this.color='';
    }
  }
  
  static verificaSTDepartamento(depa: string, depaId: string): string{
    if(depa=="JARDINERÍA Y TRANSPORTES"){return depa;}else{return depaId;}
  }
}
