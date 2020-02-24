import os
import subprocess
import shlex
import csv
import socket

from DeviceFunctions import DeviceFunctions

ABE_DIR = "/home/ajohnson/Desktop/AngluarProjects/MDM/python_rest/abe_keys"
ABE_PUBLIC_KEY_FILENAME = os.path.join(ABE_DIR, "abe.pub")
ABE_SUPER_KEY_FILENAME = os.path.join(ABE_DIR, "abe.sup")
ABE_PRIVATE_KEY_FILENAME = os.path.join(ABE_DIR, "abe.prv")

class KeyGenerator():
    # Create master key
    # Input: Comma delimited string list 
    def generatemasterkey(self, keyString, toggle):
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

        if toggle == "on":
            cmd = "java -jar " + keygen_jar_filename + " master " + ABE_PUBLIC_KEY_FILENAME + " " + ABE_SUPER_KEY_FILENAME + " " + attributes
            print(cmd)
            subprocess.call(shlex.split(cmd))
        elif toggle == "off":
            print "Remove Key File"
            if os.path.isfile("MasterKey.csv"):
                os.remove("MasterKey.csv")
        return 0

    # Create private key for device
    # Input: Device id, Comma delimited string list
    def generateprivatekey(self, device, keyString):
        print "KeyGenerator.generateprivatekey"

        if not os.path.exists(ABE_DIR):
            os.makedirs(ABE_DIR)

        file_name = device + "_privateKey.csv"
        fout = open(file_name, "w")
        fout.write(keyString)
        fout.close()

        keygen_jar_filename = "abe_key_generator.jar"

        attributes = "all "
        attr_map = keyString.split(",")
        for attr in attr_map:
            attributes += attr.replace(" ", "_") + " "
        attributes = attributes.strip()

        cmd = "java -jar " + keygen_jar_filename + " private " + ABE_PUBLIC_KEY_FILENAME + " " + ABE_SUPER_KEY_FILENAME + " " + ABE_PRIVATE_KEY_FILENAME + "_" + device + " " + attributes
        print(cmd)
        subprocess.call(shlex.split(cmd))

        deviceFunction = DeviceFunctions()
        deviceFunction.adb(device, "push " + ABE_PUBLIC_KEY_FILENAME + " /sdcard/abe_keys/abe.pub")
        deviceFunction.adb(device, "push " + ABE_PRIVATE_KEY_FILENAME + "_" + device + " /sdcard/abe_keys/abe.prv")
        return 0

    def getmasterkey(self):
        print "Get master key"
        file_bool = os.path.isfile("MasterKey.csv")
        if file_bool:
            print "Key File Found"
            with open("MasterKey.csv", "rb") as f:
                reader = csv.reader(f)
                key_list = list(reader)
            return key_list
        elif not file_bool:
            print "No Key Found"
            return 0

    def getprivatekey(self, device):
        print "Get private key"
        file_name = device + "_privateKey.csv"
        file_bool = os.path.isfile(file_name)
        if file_bool:
            print "Key File Found"
            with open(file_name, "rb") as f:
                reader = csv.reader(f)
                key_list = list(reader)
            return key_list
        elif not file_bool:
            print "No Key Found"
            return 0

    def generatemessage(self, device, keyString):
        print "Generate Message String"
        TCP_IP = '127.0.0.1'
        TCP_PORT = 2222

        print "Key String: " + keyString
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((TCP_IP, TCP_PORT))
        s.send(keyString)
        s.close()
