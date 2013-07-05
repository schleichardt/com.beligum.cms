import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "com_beligum_cms"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
  	javaCore,
    javaJdbc,
    javaEbean,
    //"com.beligum" %% "com_beligum_core" % "1.0-SNAPSHOT",
    "com.hp.gagawa" % "gagawa" % "1.0.1",
    "com.yahoo.platform.yui" % "yuicompressor" % "2.4.7"            
  )
  
  val coreProject = RootProject(file("../com.beligum.core.play"))
  
  val main = play.Project(appName, appVersion, appDependencies).settings(
    organization := "com.beligum",
    publishArtifact in(Compile, packageDoc) := false,
    sources in doc in Compile := List(),
    com.typesafe.sbteclipse.core.EclipsePlugin.EclipseKeys.skipParents in ThisBuild := false,
    com.typesafe.sbteclipse.core.EclipsePlugin.EclipseKeys.withSource := true,
    
    templatesImport ++= Seq("com.beligum._")
    
  ).dependsOn(coreProject)

}
