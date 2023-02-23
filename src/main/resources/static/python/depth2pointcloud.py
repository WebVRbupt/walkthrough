#!/usr/bin/env python
# coding: utf-8
import math

# In[25]:


import spherical_coordinates as sc

from scipy.spatial.transform import Rotation as R
import numpy as np
import os
import struct
import cv2
import open3d as o3d
from matplotlib import pyplot as plt

# In[26]:


# depth_map = cv2.imread('../../examples/Output_0482_20220418_163232_depth.png', cv2.IMREAD_GRAYSCALE)
# rgb_image = cv2.imread('../../examples/Output_0482_20220418_163232.jpg')

depth_map = cv2.imread('src/main/resources/static/distance_measurement/Output_0482_20220418_163232_depth.png', cv2.IMREAD_GRAYSCALE)
rgb_image = cv2.imread('src/main/resources/static/distance_measurement/Output_0482_20220418_163232.jpg')

# In[27]:

rgb_image = cv2.cvtColor(rgb_image, cv2.COLOR_BGR2RGB)

depth_height = depth_map.shape[0]
depth_width = depth_map.shape[1]



def calcDistance(x1,y1,x2,y2):
    """
    Input two point in equirectangular image pixel coordinata.Transform them to the Sphere Coodrinate and calculate the Euclidean distance.

    :param point1,point2: The 2D point array,  first column is x, second is y.
    :type point1,point2: array
    :return: Euclidean distance of input points.
    :rtype: num.
    """
    if(x1>depth_width-1 or x2>depth_width or y1>depth_height-1 or y2>depth_height-1):
        print("<DistanceMeasurement:Error>parameter height\width is larger than depth_picture height\width.")
        return

    point1=[x1,y1]
    point2=[x2,y2]

    theta1, phi1 = sc.erp2sph(point1, 1024)
    x3d_1 = (depth_map[y1, x1] * np.cos(phi1) * np.sin(theta1)).flatten()
    y3d_1 = -(depth_map[y1, x1] * np.sin(phi1)).flatten()
    z3d_1 = (depth_map[y1, x1] * np.cos(phi1) * np.cos(theta1)).flatten()
    #print("point1", x3d_1, y3d_1, z3d_1)


    theta2, phi2 = sc.erp2sph(point2, 1024)
    x3d_2 = (depth_map[y2, x2] * np.cos(phi2) * np.sin(theta2)).flatten()
    y3d_2 = -(depth_map[y2, x2] * np.sin(phi2)).flatten()
    z3d_2 = (depth_map[y2, x2] * np.cos(phi2) * np.cos(theta2)).flatten()
    #print("point2", x3d_2, y3d_2, z3d_2)

    distance = math.sqrt(pow(x3d_1 - x3d_2, 2) + pow(y3d_1 - y3d_2, 2) + pow(z3d_1 - z3d_2, 2))

    return distance




# output_ply_file_path = '../../examples/0482.ply'
#
# # In[30]:
#
#
# pixel_x, pixel_y = np.meshgrid(range(depth_map.shape[1]), range(rgb_image.shape[0]))
#
# # In[31]:
#
#
# theta, phi = sc.erp2sph([pixel_x, pixel_y])
#
# # In[32]:
#
#
# # spherical coordinate to point cloud
# x = (depth_map * np.cos(phi) * np.sin(theta)).flatten()
# y = -(depth_map * np.sin(phi)).flatten()
# z = (depth_map * np.cos(phi) * np.cos(theta)).flatten()
#
# # In[33]:
#
#
# r = rgb_image[pixel_y, pixel_x, 0].flatten()
# g = rgb_image[pixel_y, pixel_x, 1].flatten()
# b = rgb_image[pixel_y, pixel_x, 2].flatten()
#
# # In[34]:
#
#
# # return np.stack([x, y, z], axis=1)
# point_cloud_data = np.stack([x, y, z, r, g, b], axis=1)
# # np.append(point_cloud_data, [-37.14561132, -36.88895112, -68.23055654, 255, 0, 0])
# # np.append(point_cloud_data, [-23.2063045, 52.79364827, -39.67742559, 255, 0, 0])
# # np.append(point_cloud_data, [21.09134349, -65.46456701, -76.67167467, 255, 0, 0])
# # np.append(point_cloud_data, [-8.22308875, -68.00688029, -82.19759756, 255, 0, 0])
# # np.append(point_cloud_data, [-36.48667843, -34.15803022, -67.51260082, 255, 0, 0])
# # np.append(point_cloud_data, [-23.35239749, 49.87565594, -43.20977293, 255, 0, 0])
#
# np.append(point_cloud_data, [19.68034978, -64.61103756, -79.08285312, 255, 0, 0])
# np.append(point_cloud_data,[-4.4664331,-67.24369703,-83.11038555,255,0,0])
# # np.append(point_cloud_data, [-2.7, -68.25999769, -82.39643991, 255, 0, 0])
# # np.append(point_cloud_data, [16, -66.47481749, -83.84084976, 255, 0, 0])
#
#
# # point1 [0.63198517] [-68.25999769] [-82.39643991]
# # point2 [0.90030637] [-66.47481749] [-83.84084976]
#
# # In[35]: [16.99601071] [-64.48380801] [-78.49824281]
# # point2 [2.37421054] [-66.23706911] [-81.43717701]
#
# # [-36.48667843] [-34.15803022] [-67.51260082]
# # point2 [-23.35239749] [49.87565594] [-43.20977293]
#
# # for point in colorPoint:
# #     print(point)
# #     #point_cloud_data.append(point)
#
# # Write header of .ply file
# fid = open(output_ply_file_path, 'wb')
# fid.write(bytes('ply\n', 'utf-8'))
# fid.write(bytes('format binary_little_endian 1.0\n', 'utf-8'))
# fid.write(bytes('element vertex %d\n' % point_cloud_data.shape[0], 'utf-8'))
# fid.write(bytes('property float x\n', 'utf-8'))
# fid.write(bytes('property float y\n', 'utf-8'))
# fid.write(bytes('property float z\n', 'utf-8'))
# fid.write(bytes('property uchar red\n', 'utf-8'))
# fid.write(bytes('property uchar green\n', 'utf-8'))
# fid.write(bytes('property uchar blue\n', 'utf-8'))
# fid.write(bytes('end_header\n', 'utf-8'))
#
# # In[36]:
#
#
# # Write 3D points to .ply file
# for i in range(point_cloud_data.shape[0]):
#     fid.write(bytearray(struct.pack("fffccc", point_cloud_data[i, 0], point_cloud_data[i, 1], point_cloud_data[i, 2],
#                                     bytes(point_cloud_data[i, 3].astype(np.uint8).data),
#                                     bytes(point_cloud_data[i, 4].astype(np.uint8).data),
#                                     bytes(point_cloud_data[i, 5].astype(np.uint8).data))))
#
# fid.close()
#
# # In[37]:
#
#
# # In[ ]:
#
# pcd = o3d.io.read_point_cloud(output_ply_file_path)
#
# mesh_sphere = o3d.geometry.TriangleMesh.create_sphere(radius=1.0,
#                                                       resolution=100)
# mesh_sphere.compute_vertex_normals()
# mesh_sphere.paint_uniform_color([0.1, 0.1, 0.7])
#
# # aabb = pcd.get_axis_aligned_bounding_box()
# # aabb.color = (1, 0 , 0)
# # obb = pcd.get_oriented_bounding_box()
# # obb.color = (0 , 1, 0)
# #o3d.visualization.draw_geometries_with_editing([pcd])
# o3d.visualization.draw_geometries_with_vertex_selection([pcd])
#
# # In[ ]:
