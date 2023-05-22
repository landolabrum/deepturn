from huesdk import Hue
import colorsys

username="poftbnmZkTKgQVQt8XnIXijo-CcSOiJI1ewiVWYK"
bridge_ip="192.168.86.34"

class ez_hue:
    def __init__(self):
      self.hue = Hue(bridge_ip=bridge_ip, username=username)

    def all_on(self):
      self.hue.on()

    def all_off(self):
      self.hue.off()    

    def lights(self):
      lites = self.hue.get_lights()
      for lite in lites:
        hex_color = ez_hue.hsv_to_hex(lite.hue, lite.sat, lite.bri)
        lite.hex = hex_color
      return lites

    def get_light(self, id):
      return self.hue.get_light(id_=id)
    
    def light(self,lite):
      id=lite['id']
      lit=self.get_light(id)
      print("[ LIT ]", vars(lit))
      lit.hex = ez_hue.hsv_to_hex(lit.hue, lit.sat, lit.bri)
      if not "function" in lite:
        is_on = lit.is_on
        if is_on == False:
          lit.on()
        if is_on == True:
          lit.off()
      if "function" in lite:
        if "hex" in lite:
          lit.set_color(hexa=lite['hex'])
          lit.hex = lite['hex']
        if "bri" in lite:
          bri = int(int(lite['bri']) * 254 / 100)
          lit.set_brightness(bri)
      print("[ LIT RESP ]", vars(lit))
      return lit

    @staticmethod
    def hsv_to_hex(hue, sat, bri):
        hue /= 43690  # Scaling hue value from 0-65535 to 0-1
        # hue /= 65535  # Scaling hue value from 0-65535 to 0-1
        sat /= 254  # Scaling sat value from 0-254 to 0-1
        bri /= 254  # Scaling bri value from 0-254 to 0-1
        rgb = colorsys.hsv_to_rgb(hue, sat, bri)  # colorsys works in RGB space from 0-1
        return "#{:02x}{:02x}{:02x}".format(int(rgb[0]*255), int(rgb[1]*255), int(rgb[2]*255))  # Scaling RGB back up to 0-255
