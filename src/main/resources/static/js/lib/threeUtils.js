import { BufferGeometryUtils } from './BufferGeometryUtils.js'
// extract all geometry from a gltf scene
export function extractGeometry(gltf) {
  const geometries = []
  gltf.traverse((child) => {
    if (child.isMesh) {
      geometries.push(child.geometry)
    }
  })

  return BufferGeometryUtils.mergeBufferGeometries(geometries)
}