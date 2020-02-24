from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

from DeviceFunctions import DeviceFunctions
from KeyGenerator import KeyGenerator

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

# Devices Endpoint
# Returns formated device list
class Devices(Resource):
  def get(self):
    deviceFunction = DeviceFunctions()
    deviceList = deviceFunction.getDevices()
    keyGenerator = KeyGenerator()
    keyGenerator.getmasterkey()
    return deviceList

api.add_resource(Devices, '/devices')

# Single Devices Endpoint
# Returns single device
# Input: device id
class SingleDevice(Resource):
  def get(self, device):
    deviceFunction = DeviceFunctions()
    singleDevice = deviceFunction.getSingleDevice(device)
    return singleDevice

api.add_resource(SingleDevice, '/device/<string:device>')

# Wifi Devices Endpoint
# Returns list of devices connected via wifi
class WifiDevices(Resource):
  def get(self):
    deviceFunction = DeviceFunctions()
    wifiDevices = deviceFunction.getWifiDevices()
    return wifiDevices

api.add_resource(WifiDevices, '/wifi_devices')

# Fastboot Devices Endpoint
# Returns list of devices connected via fastboot
class FastbootDevices(Resource):
  def get(self):
    deviceFunction = DeviceFunctions()
    fbDevices = deviceFunction.getFastbootDevices()
    return fbDevices

api.add_resource(FastbootDevices, '/fastboot_devices')

# Device Provision Endpoint
# Provision device with custom built ROM
# Input: device id
class DoProvision(Resource):
  def post(self, device):
    deviceFunction = DeviceFunctions()
    deviceFunction.provisionDevice(device)
    return 200

api.add_resource(DoProvision, '/doprovision/<string:device>')

# Run ADB Command Endpoint
# Runs adb command on device
# Input: device id, action to run
class RunCommand(Resource):
  def post(self, device, action):
    deviceFunction = DeviceFunctions()
    deviceFunction.adb(device, action)
    return 200

api.add_resource(RunCommand, '/runcommand/<string:device>/<string:action>')

# Run ADB Command(Enclave) Endpoint
# Runs adb command on enclave
# Input: device id, enclave name ,action to run
class RunCommandAdvanced(Resource):
  def post(self, device, enclave, action):
    return {'RunCommandAdvanced': 'Not implemented'}, 404

api.add_resource(RunCommandAdvanced, '/runcommandadvanced/<string:device>/<string:enclave>/<string:action>')

# Get Master Key Endpoint
# Get master key from csv file
# Input: 
class GetMasterKey(Resource):
  def get(self):
    keyGenerator = KeyGenerator()
    masterKey = keyGenerator.getmasterkey()
    return masterKey

api.add_resource(GetMasterKey, '/get_master')

# Get Private Key Endpoint
# Get priavte key from csv file
# Input: device id
class GetPrivaterKey(Resource):
  def get(self, device):
    keyGenerator = KeyGenerator()
    privateKey = keyGenerator.getprivatekey(device)
    return privateKey

api.add_resource(GetPrivaterKey, '/get_private/<string:device>')

# Generate Master Key Endpoint
# Generates master key for device group
# Input: key string
class GenerateMasterKey(Resource):
  def post(self, key_string, toggle):
    keyGenerator = KeyGenerator()
    keyGenerator.generatemasterkey(key_string, toggle)
    return 200

api.add_resource(GenerateMasterKey, '/gen_master/<string:key_string>/<string:toggle>')

# Generate Message Policy 
# Generates string for policy
# Input: device id, key string
class GenerateMessageString(Resource):
  def post(self, device, key_string):
    keyGenerator = KeyGenerator()
    keyGenerator.generatemessage(device, key_string)
    return 200

api.add_resource(GenerateMessageString, '/gen_message/<string:device>/<string:key_string>')

# Generate Private Key Endpoint
# Generates private key for a device
# Input: device id, key string
class GeneratePrivateKey(Resource):
  def post(self, device, key_string):
    keyGenerator = KeyGenerator()
    keyGenerator.generateprivatekey(device, key_string)
    return 200

api.add_resource(GeneratePrivateKey, '/gen_private/<string:device>/<string:key_string>')

# Toggle ADB WIFI On
# Used to set adb server to use wifi
class WifiOn(Resource):
  def post(self):
    cmd = 'adb tcpip 5556'
    return {'wifi_on': 'Not implemented'}, 404

api.add_resource(WifiOn, '/wifi_on')

# Connect Device to ADB WIFI
# Used to connect a device to adb over wifi
# Input: device id
class WifiConnectDevice(Resource):
  def post(self, device):
    deviceFunction = DeviceFunctions()
    deviceFunction.doWifiConnect(device)
    return 200

api.add_resource(WifiConnectDevice, '/wifi_connect/<string:device>')

# Toggle ADB WIFI Off
# Used to set adb server to not use wifi
class WifiOff(Resource):
  def post(self):
    cmd = 'adb usb'
    return {'wifi_off': 'Not implemented'}, 404

api.add_resource(WifiOff, '/wifi_off')

if __name__ == '__main__':
     app.run(port='5002')
