# Product Plan: Automated 2D-to-Animated-3D Pet Pipeline

## **Executive Summary**

The objective is to build a high-quality, fully automated, **API-only backend pipeline** that converts a single 2D image of a pet (quadruped) into an animated 3D model, bypassing manual software like Blender entirely.  
While standard AI generative 3D pipelines are heavily optimized for humanoids (bipeds), specialized foundation models and precise parameter configurations make a programmatic quadruped pipeline viable. However, strict upfront constraints must be enforced to maintain production-grade code quality.

---

## **Key Takeaways & Architecture Blueprint**

### **1. The Core 3D Pipeline**

* **Stage 1: 2D-to-3D Mesh Generation:** Use **Hunyuan3D** (or alternatives like **Meshy v6**) to generate the initial 3D asset (.glb). For optimal rigging, the output topology must be configured as **quad-dominant** and **symmetrical** to prevent severe skeletal mesh clipping.  
* **Stage 2: Auto-Rigging & Animation:** Traditional tools (like Adobe Mixamo) or default API endpoints will fail because they attempt to force a bipedal skeleton onto a four-legged animal. The pipeline requires explicit multi-rig foundation models that support a quadruped structure (spine, neck, tail, and four independent limbs).

### **2. Platform Evaluation**

* **Tripo3D (Recommended for Production API):** Provides native, programmatic quadruped rigging via their **UniRig** engine. By explicitly passing `"rig_type": "quadruped"` to their `/v1/task` endpoint, the backend correctly maps a four-legged structure and allows you to programmatically bake quadruped motion presets (walk, run, idle) into the final asset.  
* **Meshy AI (Not Viable for API Rigging):** While Meshy's web dashboard supports excellent quadruped positioning, their developer API currently restricts programmatic auto-rigging exclusively to humanoids.

### **3. Critical Engineering Constraints**

To ensure architectural correctness and prevent the pipeline from failing or generating warped, "melted" geometries, the frontend user interface must strictly guard data ingestion quality:

* **No Fused Limbs:** The input pet photo must feature a **three-quarter isometric profile view** where all four limbs are cleanly separated. If the limbs touch or overlap heavily in 2D, the 3D generator will fuse them into a single mesh column, causing the auto-rigger to fail.  
* **Alpha Masking Requirement:** Images must pass through a background-removal utility (like *Remove.bg* or *BiRefNet*) to deliver a clean, transparent PNG to the 3D generation engine, eliminating environmental texture artifacts.
