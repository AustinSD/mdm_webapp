cd ~/ANDROID_SHARE/

export OUT_DIR_COMMON_BASE=/usr/games/DragonBoardKernel/android_out/
source build/envsetup.sh
lunch aosp_marlin-eng


echo ANDROID_PRODUCT_OUT:
echo $ANDROID_PRODUCT_OUT

cd /home/ajohnson/Desktop/AngluarProjects/MDM/python_rest/
source venv/bin/activate
python rest_server.py
