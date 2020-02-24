import logging
import os
import os.path as op
import subprocess
import time
import shlex

from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from subprocess import Popen, PIPE

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

ABE_DIR = "/home/ajohnson/Desktop/python_rest/abe_keys"
ABE_PUBLIC_KEY_FILENAME = os.path.join(ABE_DIR, "abe.pub")
ABE_SUPER_KEY_FILENAME = os.path.join(ABE_DIR, "abe.sup")
ABE_PRIVATE_KEY_FILENAME = os.path.join(ABE_DIR, "abe.prv")

class Devices(Resource):
    def get(self):
        cmd = 'adb devices'
        command = subprocess.check_output(cmd.split())
        mylist = command.split('\n')
        mylist.remove("List of devices attached")
        result = []

        for x in mylist:
             if len(x) != 0:
                 tempList = x.split('\t')
                 releasecmd = 'adb -s ' + tempList[0] + ' shell getprop ro.build.version.release'
                 releasestr = subprocess.check_output(releasecmd.split())
                 modelcmd = 'adb -s ' + tempList[0] + ' shell getprop ro.product.model'
                 modelstr = subprocess.check_output(modelcmd.split())
                 enclavecmd = 'adb -s ' + tempList[0] + ' shell cell list'
                 enclavestr = ''
                 enclavearray = []
                 enclaveDict = []
                 try:
                     enclavestr = subprocess.check_output(enclavecmd.split())
                     enclavearray = enclavestr.strip().split('\n')

                     if len(enclavearray) > 1:
                         for x in enclavearray:
                             temp = x.split()
                             if len(temp) < 2:
                                 temp.append('(not running)')
                                 temp.append('(not running)')
                             enclaveDict.append(dict(
                                        name=temp[0],
                                        status=temp[1],
                                        pid=temp[2]))

                 except:
                     enclaveDict.append(dict(
                                        name='No Enclave',
                                        status='Not Running',
                                        pid='N/A'))

                 tempDict = dict(
                                 id=tempList[0],
                                 status=tempList[1],
                                 release=releasestr.strip(),
                                 model=modelstr.strip(),
                                 enclave=enclaveDict)
                 result.append(tempDict)

        return result

class SingleDevice(Resource):
    def get(self, name):
        cmd = 'adb devices'
        command = subprocess.check_output(cmd.split())
        mylist = command.split('\n')
        mylist.remove("List of devices attached")
        result = []

        for x in mylist:
             if len(x) != 0:
                 tempList = x.split('\t')
                 if tempList[0] == name:
                   releasecmd = 'adb -s ' + tempList[0] + ' shell getprop ro.build.version.release'
                   releasestr = subprocess.check_output(releasecmd.split())
                   modelcmd = 'adb -s ' + tempList[0] + ' shell getprop ro.product.model'
                   modelstr = subprocess.check_output(modelcmd.split())
                   enclavecmd = 'adb -s ' + tempList[0] + ' shell cell list'
                   enclavestr = ''
                   enclavearray = []
                   enclaveDict = []
                   try:
                       enclavestr = subprocess.check_output(enclavecmd.split())
                       enclavearray = enclavestr.strip().split('\n')

                       if len(enclavearray) > 1:
                           for x in enclavearray:
                               temp = x.split()

                               if len(temp) < 2:
                                   temp.append('(not running)')
                                   temp.append('(not running)')
                               enclaveDict.append(dict(
                                          name=temp[0],
                                          status=temp[1],
                                          pid=temp[2]))

                   except:
                       enclaveDict.append(dict(
                                          name='No Enclave',
                                          status='Not Running',
                                          pid='N/A'))

                   tempDict = dict(
                                   id=tempList[0],
                                   status=tempList[1],
                                   release=releasestr.strip(),
                                   model=modelstr.strip(),
                                   enclave=enclaveDict)
                   result.append(tempDict)

        return tempDict

class GetWifiDevices(Resource):
    def get(self):
        cmd = 'arp -a'
        command = subprocess.check_output(cmd.split())
        mylist = command.split()
        result = []

        for x in mylist:
            if x.startswith("(10."):
                tempList = x.strip(')').strip('(')
                tempDict = dict(id=tempList)
                result.append(tempDict)

        return result

class FastbootDevices(Resource):
    def get(self):
        cmd = 'fastboot devices'
        command = subprocess.check_output(cmd.split())
        mylist = command.split('\n')
        result = []

        for x in mylist:
             if len(x) != 0:
                 tempList = x.split('\t')
                 tempDict = dict(
                                 id=tempList[0],
                                 status=tempList[1])
                 result.append(tempDict)

        return result

class DoProvision(Resource):
    def get(self, name):
        my_env = os.environ.copy()
        my_env["ANDROID_PRODUCT_OUT"] = "/usr/games/DragonBoardKernel/android_out/ANDROID_SHARE/target/product/marlin/"

        cmd = 'fastboot -s ' + name + ' flashall -w'
        command = subprocess.Popen(cmd, env=my_env, shell=True)
        return {'DoProvision': 'Not implemented'} 

class RunCommand(Resource):
    def get(self, name, action):
        cmd = 'adb -s ' + name + ' ' + action
        print cmd
        command = subprocess.call(cmd.split())
        return {'RunCommand': 'Not implemented'} 

class RunCommandAdvanced(Resource):
    def get(self, name, action):
        cmd1 = 'adb -s ' + name + ' shell '
        print cmd1
        cmd2 = 'cell console alpha'
        print cmd2
        cmd3 = action
        print cmd3
        p = subprocess.Popen(cmd1.split(), stdin=PIPE)
        time.sleep(1)
        p.stdin.write(cmd2.encode('utf-8'))
        time.sleep(1)
        p.communicate(input = '1\n2')
        #p.communicate(input=b'\n')
        #p.stdin.flush()
        time.sleep(2)
        p.stdin.write(cmd3.encode('utf-8'))
        p.stdin.write('\n'.encode('utf-8'))
        p.stdin.flush()
        time.sleep(3)
        p.kill()

        return {'RunCommandAdvanced': 'Not implemented'}

class GenerateMasterKey(Resource):
    def get(self, action):
        print action
        keyGenerator = KeyGenerator()
        keyGenerator.generatemasterkey(action)
        return {'gen_master': 'Not implemented'} 

class GeneratePrivateKey(Resource):
    def get(self, name, action):
        keyGenerator = KeyGenerator()
        keyGenerator.generateprivatekey(name, action)
        return {'gen_private': 'Not implemented'}

    def post(self, name, action):
        keyGenerator = KeyGenerator()
        keyGenerator.generateprivatekey(name, action)
        return name, 200

class GenerateAllPrivateKeys(Resource):
    def get(self, name, action):
        keyGenerator = KeyGenerator()
        keyGenerator.generateprivatekey(name, action)
        return {'gen_private': 'Not implemented'} 

class WifiOn(Resource):
    def get(self):
        cmd = 'adb tcpip 5556'
        return {'wifi_on': 'Not implemented'} 

class WifiOff(Resource):
    def get(self):
        cmd = 'adb usb'
        return {'wifi_off': 'Not implemented'} 
       
api.add_resource(Devices, '/devices')
api.add_resource(SingleDevice, '/device/<string:name>')
api.add_resource(GetWifiDevices, '/wifi_devices')
api.add_resource(FastbootDevices, '/fastboot_devices')
api.add_resource(DoProvision, '/doprovision/<string:name>')
api.add_resource(RunCommand, '/runcommand/<string:name>/<string:action>')
api.add_resource(RunCommandAdvanced, '/runcommandadvanced/<string:name>/<string:action>')
api.add_resource(GenerateMasterKey, '/gen_master/<string:action>')
api.add_resource(GeneratePrivateKey, '/gen_private/<string:name>/<string:action>')
api.add_resource(GenerateAllPrivateKeys, '/gen_all_private/<string:name>/<string:action>')
api.add_resource(WifiOn, '/wifi_on')
api.add_resource(WifiOff, '/wifi_off')

class DeviceFunctions():
    def adb(self, device, cmd):
        adbcmd = "adb -s " + device + " " + cmd
        print adbcmd
        command = subprocess.call(adbcmd.split())
        return 0

    def get_devices():
        return 0

class KeyGenerator():
    def generatemasterkey(self, keyString):
        print "KeyGenerator.generatemasterkey"

        if not os.path.exists(ABE_DIR):
            os.makedirs(ABE_DIR)

        fout = open("MasterKey.csv", "w")
        fout.write(keyString)
        fout.close()

        keygen_jar_filename = "abe_key_generator.jar"

        attributes = "all "
        attr_map = keyString.split(",")
        for attr in attr_map:
            attributes += attr.replace(" ", "_") + " "
        attributes = attributes.strip()

        cmd = "java -jar " + keygen_jar_filename + " master " + ABE_PUBLIC_KEY_FILENAME + " " + ABE_SUPER_KEY_FILENAME + " " + attributes
        print(cmd)
        subprocess.call(shlex.split(cmd))
        return 0

    def generateprivatekey(self, name, keyString):
        print "KeyGenerator.generateprivatekey"

        if not os.path.exists(ABE_DIR):
            os.makedirs(ABE_DIR)

        keygen_jar_filename = "abe_key_generator.jar"

        attributes = "all "
        attr_map = keyString.split(",")
        for attr in attr_map:
            attributes += attr.replace(" ", "_") + " "
        attributes = attributes.strip()

        cmd = "java -jar " + keygen_jar_filename + " private " + ABE_PUBLIC_KEY_FILENAME + " " + ABE_SUPER_KEY_FILENAME + " " + ABE_PRIVATE_KEY_FILENAME + " " + attributes
        print(cmd)
        subprocess.call(shlex.split(cmd))

        self.adb(name, "push " + ABE_PUBLIC_KEY_FILENAME + " /data/primary/abe_keys/abe.pub")
        self.adb(name, "push " + ABE_PRIVATE_KEY_FILENAME + " /data/primary/abe_keys/abe.prv")
        return 0

    def adb(self, device, cmd):
        adbcmd = "adb -s " + device + " " + cmd
        print adbcmd
        command = subprocess.call(adbcmd.split())
        return 0

if __name__ == '__main__':
     app.run(port='5002')
