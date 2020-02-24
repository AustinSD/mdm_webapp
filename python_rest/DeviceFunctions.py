import logging
import os
import subprocess

class DeviceFunctions():
  # Simple adb command
  # Input: device id, command to run
  def adb(self, device, cmd):
    adbcmd = "adb -s " + device + " " + cmd
    return subprocess.check_output(adbcmd.split())

  # Get formated list of adb devices
  def getDevices(self):
    cmd = 'adb devices'
    command = subprocess.check_output(cmd.split())
    mylist = command.split('\n')
    mylist.remove("List of devices attached")
    result = []

    for x in mylist:
      if len(x) != 0:
        tempList = x.split('\t')
        device = self.getSingleDevice(tempList[0])
        result.append(device)

    return result

  # Get formated adb device
  # Input: device id
  def getSingleDevice(self, device):
    try:
      releasestr = self.adb(device, 'shell getprop ro.build.version.release')
    except:
      releasestr = '8.1' 

    try:
      modelstr = self.adb(device, 'shell getprop ro.product.model')
    except:
      modelstr = 'Android Phone' 

    try:
      statestr = self.adb(device, "get-state")
    except:
      statestr = 'device' 

    enclavearray = []
    enclaveDict = []
    try:
      enclavearray = self.adb(device, 'shell cell list').strip().split('\n')
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

    result = dict(
                 id=device,
                 status=statestr.strip(),
                 release=releasestr.strip(),
                 model=modelstr.strip(),
                 enclave=enclaveDict,
                 wifi=False)
  
    return result

  # Get List of devices connect via wifi
  def getWifiDevices(self):
    cmd = 'arp -a'
    command = subprocess.check_output(cmd.split())
    mylist = command.split()
    result = []

    for x in mylist:
      if x.startswith("(10."):
        tempList = x.strip(')').strip('(')
        tempDict = dict(
                        id=tempList,
                        wifi=True)
        result.append(tempDict)

    return result

  # Get list of fastboot devices
  def getFastbootDevices(self):
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

  # Provision device with custom ROM
  # Input: device id
  # TODO: android out folder is hard coded, need to fix this
  def provisionDevice(self, name):
    my_env = os.environ.copy()
    my_env["ANDROID_PRODUCT_OUT"] = "/usr/games/DragonBoardKernel/android_out/ANDROID_SHARE/target/product/marlin/"

    cmd = 'fastboot -s ' + name + ' flashall -w'
    command = subprocess.Popen(cmd, env=my_env, shell=True)
    return 0

  # Simple adb command
  # Input: device id, command to run
  def doWifiConnect(self, device):
    adbcmd = 'adb connect ' + device + ':5556'
    print adbcmd
    return subprocess.check_output(adbcmd.split())

  # Send command to enclave
  # Input: device id, encalve name, command to run
  # TODO: This method is not functional yet
  def doEnclaveCommand(self, device, enclave, action):
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
    return 0 
